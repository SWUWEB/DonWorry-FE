import { useEffect, useRef, useState } from 'react'
import { formatKRW } from '@/shared/utils/currency'
import { useConsumptionReport } from '../hooks/useConsumptionReport'
import DonutChart from './DonutChart'
import CategoryItem from './CategoryItem'
import styles from './ConsumptionReportForm.module.css'
import SavingStatusCard from './SavingStatusCard'
import SavingCategoryItem from './SavingCategoryItem'

// 카테고리가 9종이라 색도 9개를 둡니다.
// 개수가 모자라면 서로 다른 카테고리에 같은 색이 배정돼 차트/범례에서 구분이 안 됩니다.
const CATEGORY_COLORS = [
  '#2F7F82',
  '#4ECDC4',
  '#FFE66D',
  '#FF6B6B',
  '#A8E6CF',
  '#DDA0DD',
  '#F4A261',
  '#8AB6F9',
  '#B0BEC5',
]

// 백엔드 카테고리 코드 9종 기준 (소비기록 API와 동일한 코드 체계)
const CATEGORY_ICONS: Record<string, string> = {
  FASHION: '👗',
  BEAUTY: '💄',
  FOOD_SNACK: '🍔',
  CAFE_DESSERT: '☕',
  HOBBY_GOODS: '🎮',
  ELECTRONICS: '📱',
  HEALTH_FITNESS: '💪',
  TRAVEL: '✈️',
  ETC: '📦',
}

// 서버는 KST 기준으로 "미래 월"을 판단해 400을 반환하므로,
// 기기 시간대와 무관하게 서울 기준 연/월에서 목록을 만듭니다.
const KST_YEAR_MONTH = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
})

function getRecentMonths(count: number): { label: string; value: string }[] {
  const parts = KST_YEAR_MONTH.formatToParts(new Date())
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  const currentYear = get('year')
  const currentMonth = get('month')

  return Array.from({ length: count }, (_, i) => {
    // 월을 0-based로 바꿔 뺀 뒤 다시 1-based로 되돌려 연도 넘김을 자연스럽게 처리합니다.
    const date = new Date(Date.UTC(currentYear, currentMonth - 1 - i, 1))
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1

    return {
      label: `${year}년 ${month}월`,
      value: `${year}-${String(month).padStart(2, '0')}`,
    }
  })
}

export default function ConsumptionReportForm() {
  const months = getRecentMonths(3)
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [isOpen, setIsOpen] = useState(false)
  const monthRef = useRef<HTMLDivElement>(null)

  // 드롭다운 바깥을 누르면 닫습니다. (알림 화면 정렬 드롭다운과 동일한 방식)
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const { data, isLoading, isError, refetch } = useConsumptionReport(selectedMonth.value)

  return (
    <div className={styles.wrapper}>
      {/* 월 선택 */}
      <div className={styles.monthWrapper} ref={monthRef}>
        <button type="button" className={styles.monthButton} onClick={() => setIsOpen(!isOpen)}>
          <span>{selectedMonth.label}</span>
          <span className={styles.arrow}>▼</span>
        </button>

        {isOpen && (
          <div className={styles.monthDropdown}>
            {months.map((month) => (
              <button
                key={month.value}
                type="button"
                className={styles.monthItem}
                onClick={() => {
                  setSelectedMonth(month)
                  setIsOpen(false)
                }}
              >
                {month.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && <p className={styles.status}>불러오는 중...</p>}
      {isError && (
        <div className={styles.status}>
          <p>데이터를 불러오지 못했습니다.</p>
          <button type="button" className={styles.retryButton} onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      )}

      {data && (
        <>
          {/* 총 소비 요약 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>총 소비 요약</h2>
            <div className={styles.summaryContent}>
              {/* 차트와 범례가 같은 색·같은 비율을 쓰도록 동일한 배열에서 파생시킵니다. */}
              <DonutChart
                totalAmount={data.totalConsumption.totalAmount}
                segments={data.totalConsumption.categories.map((cat, i) => ({
                  color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  ratio: cat.ratio,
                }))}
              />
              <div className={styles.legend}>
                {data.totalConsumption.categories.map((cat, i) => (
                  <CategoryItem
                    key={cat.categoryCode}
                    color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                    name={cat.categoryLabel}
                    amount={formatKRW(cat.amount)}
                    percent={`${cat.ratio}%`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 통합 절약 현황 */}
          <section className={styles.card}>
            <SavingStatusCard
              savingStatus={data.savingStatus}
              goalAchievement={data.goalAchievement}
            />
          </section>

          {/* 나의 충동 소비 패턴 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>나의 충동 소비 패턴</h2>
            {data.insights.hasEnoughData ? (
              <div className={styles.patternBox}>
                {data.insights.insights.map((insight, i) => (
                  <div key={i} className={styles.patternCard}>
                    <span className={styles.patternIcon}>
                      {insight.type === 'VULNERABLE_TIME' ? '⏰' : '🔗'}
                    </span>
                    <div className={styles.patternContent}>
                      {insight.type === 'VULNERABLE_TIME' && (
                        <>
                          <p className={styles.patternTitle}>
                            가장 취약한 시간대는 {insight.weekdayLabel}요일{' '}
                            {insight.hour != null ? `${insight.hour}시` : ''}
                          </p>
                          {insight.ratio != null && (
                            <p className={styles.patternDescription}>
                              전체 지출의 {insight.ratio}%가 이 시간대에 발생했습니다.
                            </p>
                          )}
                        </>
                      )}
                      {insight.type === 'INFLOW_CHANNEL' && (
                        <>
                          <p className={styles.patternTitle}>
                            주요 충동 유입 경로는 {insight.channel}
                          </p>
                          {insight.count != null && (
                            <p className={styles.patternDescription}>
                              해당 경로를 통한 소비 시도가 {insight.count}건 기록되었습니다.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyInsight}>
                소비 기록이 3건 이상 쌓이면 패턴을 분석해드려요.
              </p>
            )}
          </section>

          {/* 카테고리별 소비 및 절약 요약 */}
          {data.categoryDefenseSummary.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>카테고리별 소비 및 절약 요약</h2>
              {data.categoryDefenseSummary.map((cat) => (
                <SavingCategoryItem
                  key={cat.categoryCode}
                  icon={CATEGORY_ICONS[cat.categoryCode] ?? '📦'}
                  name={cat.categoryLabel}
                  defense={cat.defenseRate}
                  saved={cat.skippedAmount.toLocaleString('ko-KR')}
                  spent={cat.consumedAmount.toLocaleString('ko-KR')}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
