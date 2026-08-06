import styles from './SavingStatusCard.module.css'

export default function SavingStatusCard() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          통합 절약 현황
        </h2>

        <span className={styles.count}>
          총 24번의 소비 시도 중
        </span>
      </div>

      <div className={styles.summary}>
        <div className={styles.leftCard}>
          <p className={styles.label}>
            참은 소비 (절약액)
          </p>

          <h3 className={styles.money}>
            ₩ 345,000
          </h3>

          <span className={styles.desc}>
            방어 성공 18회
          </span>
        </div>

        <div className={styles.rightInfo}>
          <p className={styles.label}>
            실제 지출 금액
          </p>

          <h3 className={styles.money}>
            ₩ 120,000
          </h3>

          <span className={styles.desc}>
            지출 결제 6회
          </span>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.goalHeader}>
        <span className={styles.goalTitle}>
          🎯 절약 목표
        </span>

        <span className={styles.goalPercent}>
          69% 달성
        </span>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressFill} />
      </div>

      <p className={styles.remain}>
        155,000원 남았어요!
      </p>
    </div>
  )
}