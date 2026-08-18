import { useState } from 'react'
import DonutChart from './DonutChart'
import CategoryItem from './CategoryItem'
import styles from './ConsumptionReportForm.module.css'
import SavingStatusCard from './SavingStatusCard'
import SavingCategoryItem from './SavingCategoryItem'
import { CategoryIcon } from '@/assets/icons/CategoryIcon.tsx'
import { CATEGORY_COLORS, CATEGORY_ICON_MAP } from '@/assets/icons/CategoryIconMap.tsx'
import type { Category } from '@/features/temptation/types'
import { getCurrentYearMonth, shiftYearMonth } from '@/shared/utils/date'
import { useConsumptionReport } from '../hooks/useReport'
import type { ConsumptionReportInsight } from '../api/reportApi'

const FALLBACK_COLOR = '#D9D9D9'

function toCategory(label: string): Category {
  return label in CATEGORY_ICON_MAP ? (label as Category) : '기타'
}

function formatYearMonthKorean(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return `${year}년 ${Number(month)}월`
}

function InsightCard({ insight }: { insight: ConsumptionReportInsight }) {
  if (insight.type === 'VULNERABLE_TIME') {
    return (
      <div className={styles.patternCard}>
        <span className={styles.patternIcon}>⏰</span>

        <div className={styles.patternContent}>
          <p className={styles.patternTitle}>
            가장 취약한 시간대는 {insight.weekdayLabel}요일 밤 {insight.hour}시
          </p>

          <p className={styles.patternDescription}>
            전체 지출의 {insight.ratio}%가 {insight.weekdayLabel}요일 이 시간대에 발생했습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.patternCard}>
      <span className={styles.patternIcon}>🔗</span>

      <div className={styles.patternContent}>
        <p className={styles.patternTitle}>주요 충동 유입 경로는 {insight.channel}</p>

        <p className={styles.patternDescription}>
          기록된 소비 시도 중 {insight.count}건이 이 경로를 통해 유입되었습니다.
        </p>
      </div>
    </div>
  )
}

export default function ConsumptionReportForm() {
  const currentYearMonth = getCurrentYearMonth()
  const months = [
    currentYearMonth,
    shiftYearMonth(currentYearMonth, -1),
    shiftYearMonth(currentYearMonth, -2),
  ]

  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useConsumptionReport(selectedMonth)

  return (
    <div className={styles.wrapper}>
      {/* 월 선택 */}
      <div className={styles.monthWrapper}>
        <button type="button" className={styles.monthButton} onClick={() => setIsOpen(!isOpen)}>
          <span>{formatYearMonthKorean(selectedMonth)}</span>

          <span className={styles.arrow}>▼</span>
        </button>

        {isOpen && (
          <div className={styles.monthDropdown}>
            {months.map((month) => (
              <button
                key={month}
                type="button"
                className={styles.monthItem}
                onClick={() => {
                  setSelectedMonth(month)
                  setIsOpen(false)
                }}
              >
                {formatYearMonthKorean(month)}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && <p className={styles.message}>불러오는 중...</p>}

      {isError && (
        <div className={styles.message}>
          <p>리포트를 불러오지 못했습니다.</p>
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
              <DonutChart totalAmount={data.totalConsumption.totalAmount} />

              <div className={styles.legend}>
                {data.totalConsumption.categories.map((category) => (
                  <CategoryItem
                    key={category.categoryCode}
                    color={CATEGORY_COLORS[toCategory(category.categoryLabel)] ?? FALLBACK_COLOR}
                    name={category.categoryLabel}
                    amount={`${category.amount.toLocaleString('ko-KR')}원`}
                    percent={`${category.ratio}%`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 통합 절약 현황 */}
          <section className={styles.card}>
            <SavingStatusCard
              totalAttemptCount={data.savingStatus.totalAttemptCount}
              skipped={data.savingStatus.skipped}
              consumed={data.savingStatus.consumed}
              goalAchievement={data.goalAchievement}
            />
          </section>

          {/* 나의 충동 소비 패턴 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>나의 충동 소비 패턴</h2>

            {data.insights.hasEnoughData ? (
              <div className={styles.patternBox}>
                {data.insights.insights.map((insight, index) => (
                  <InsightCard key={`${insight.type}-${index}`} insight={insight} />
                ))}
              </div>
            ) : (
              <p className={styles.patternDescription}>
                아직 소비 기록이 충분하지 않아요. 기록이 쌓이면 패턴을 분석해드릴게요.
              </p>
            )}
          </section>

          {/* 카테고리별 소비 및 절약 요약 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>카테고리별 소비 및 절약 요약</h2>

            {data.categoryDefenseSummary.map((summary) => (
              <SavingCategoryItem
                key={summary.categoryCode}
                icon={<CategoryIcon category={toCategory(summary.categoryLabel)} size={20} />}
                name={summary.categoryLabel}
                defense={summary.defenseRate}
                saved={summary.skippedAmount.toLocaleString('ko-KR')}
                spent={summary.consumedAmount.toLocaleString('ko-KR')}
              />
            ))}
          </section>
        </>
      )}
    </div>
  )
}
