import { useState } from 'react'
import { useConsumptionReport } from '../hooks/useConsumptionReport'
import DonutChart from './DonutChart'
import CategoryItem from './CategoryItem'
import styles from './ConsumptionReportForm.module.css'
import SavingStatusCard from './SavingStatusCard'
import SavingCategoryItem from './SavingCategoryItem'

const CATEGORY_COLORS = ['#2F7F82', '#4ECDC4', '#FFE66D', '#FF6B6B', '#A8E6CF', '#DDA0DD']

const CATEGORY_ICONS: Record<string, string> = {
  FOOD_SNACK: '🍔',
  FASHION: '👗',
  HOBBY: '🎮',
  BEAUTY: '💄',
  TRAVEL: '✈️',
  ELECTRONICS: '📱',
  CULTURE: '🎬',
  HEALTH: '💊',
  PET: '🐾',
  ETC: '📦',
}

function getRecentMonths(count: number): { label: string; value: string }[] {
  const result = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${d.getFullYear()}년 ${d.getMonth() + 1}월`
    result.push({ label, value })
  }
  return result
}

export default function ConsumptionReportForm() {
  const months = getRecentMonths(3)
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [isOpen, setIsOpen] = useState(false)

  const { data, loading, error } = useConsumptionReport(selectedMonth.value)

  return (
    <div className={styles.wrapper}>
      {/* 월 선택 */}
      <div className={styles.monthWrapper}>
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

      {loading && <p className={styles.status}>불러오는 중...</p>}
      {error && <p className={styles.status}>데이터를 불러오지 못했습니다.</p>}

      {data && (
        <>
          {/* 총 소비 요약 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>총 소비 요약</h2>
            <div className={styles.summaryContent}>
              <DonutChart totalAmount={data.totalConsumption.totalAmount} />
              <div className={styles.legend}>
                {data.totalConsumption.categories.map((cat, i) => (
                  <CategoryItem
                    key={cat.categoryCode}
                    color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                    name={cat.categoryLabel}
                    amount={`${cat.amount.toLocaleString('ko-KR')}원`}
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
                          <p className={styles.patternDescription}>
                            전체 지출의 {insight.ratio}%가 이 시간대에 발생했습니다.
                          </p>
                        </>
                      )}
                      {insight.type === 'INFLOW_CHANNEL' && (
                        <>
                          <p className={styles.patternTitle}>
                            주요 충동 유입 경로는 {insight.channel}
                          </p>
                          <p className={styles.patternDescription}>
                            해당 경로를 통한 소비 시도가 {insight.count}건 기록되었습니다.
                          </p>
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
