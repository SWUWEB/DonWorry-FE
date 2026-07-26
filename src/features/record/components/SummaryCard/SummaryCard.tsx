import styles from './SummaryCard.module.css'
import legendBg from '@/assets/legend-bg.svg'
import DonutChart from '@/features/record/components/DonutChart'

// 하드코딩됨. API 연결 시 수정 예정
const SAVED_PERCENT = 65
const CONSUME_PERCENT = 35

export default function SummaryCard() {
  return (
    <section className={styles.summary}>
      <div className={styles.card}>
        <div className={styles.left}>
          <p className={styles.title}>소비 vs 참은 소비</p>

          <h2 className={styles.price}>+96,500원</h2>

          <div className={styles.legendWrapper}>
            <img src={legendBg} alt="" className={styles.legendBg} />

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.leftItem}>
                  <span className={`${styles.dot} ${styles.save}`} />
                  <span>참았어요</span>
                </div>

                <span className={styles.percent}>{SAVED_PERCENT}%</span>
              </div>

              <div className={styles.legendItem}>
                <div className={styles.leftItem}>
                  <span className={`${styles.dot} ${styles.consume}`} />
                  <span>샀어요</span>
                </div>

                <span className={styles.percent}>{CONSUME_PERCENT}%</span>
              </div>
            </div>
          </div>

          <p className={styles.note}>*28일간 데이터를 기준으로 보여드립니다</p>
        </div>

        <div className={styles.chartWrapper}>
          <DonutChart
            centerLabel={`${SAVED_PERCENT}%`}
            size={130}
            strokeWidth={26}
            segments={[
              { percent: SAVED_PERCENT, fill: 'var(--color-main-400, #389698)' },
              { percent: CONSUME_PERCENT, fill: 'var(--color-gray-300, #5b6b6a)' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
