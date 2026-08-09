import styles from './SummaryCard.module.css'
import legendBg from '@/assets/legend-bg.svg'
import DonutChart from '@/features/record/components/DonutChart'
import { useConsumptionRatio } from '@/features/record/hooks/useConsumptionRecords'
import { formatKRW } from '@/shared/utils/currency'

export default function SummaryCard() {
  const { data, isLoading, isError, refetch } = useConsumptionRatio()

  if (isLoading) {
    return (
      <section className={styles.summary}>
        <p className={styles.message}>불러오는 중...</p>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className={styles.summary}>
        <div className={styles.message}>
          <p>소비 비율을 불러오지 못했습니다.</p>
          <button type="button" className={styles.retryButton} onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      </section>
    )
  }

  const { skippedAmount, skippedRatio, consumedRatio } = data

  return (
    <section className={styles.summary}>
      <div className={styles.card}>
        <div className={styles.left}>
          <p className={styles.title}>소비 vs 참은 소비</p>

          <h2 className={styles.price}>+{formatKRW(skippedAmount)}</h2>

          <div className={styles.legendWrapper}>
            <img src={legendBg} alt="" className={styles.legendBg} />

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.leftItem}>
                  <span className={`${styles.dot} ${styles.save}`} />
                  <span>참았어요</span>
                </div>

                <span className={styles.percent}>{skippedRatio}%</span>
              </div>

              <div className={styles.legendItem}>
                <div className={styles.leftItem}>
                  <span className={`${styles.dot} ${styles.consume}`} />
                  <span>샀어요</span>
                </div>

                <span className={styles.percent}>{consumedRatio}%</span>
              </div>
            </div>
          </div>

          <p className={styles.note}>*28일간 데이터를 기준으로 보여드립니다</p>
        </div>

        <div className={styles.chartWrapper}>
          <DonutChart
            centerLabel={`${skippedRatio}%`}
            size={130}
            strokeWidth={26}
            segments={[
              { percent: skippedRatio, fill: 'var(--color-main-400, #389698)' },
              { percent: consumedRatio, fill: 'var(--color-gray-300, #5b6b6a)' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
