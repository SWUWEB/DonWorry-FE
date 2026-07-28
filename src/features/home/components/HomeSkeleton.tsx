import styles from './HomeSkeleton.module.css'

export default function HomeSkeleton() {
  return (
    <div className={styles.wrapper} role="status" aria-label="홈 정보 불러오는 중">
      <div className={styles.banner} aria-hidden="true">
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={`${styles.line} ${styles.lineLong}`} />
      </div>
      <div className={styles.card} aria-hidden="true" />
      <div className={styles.row} aria-hidden="true">
        <div className={styles.halfCard} />
        <div className={styles.halfCard} />
      </div>
      <div className={styles.card} aria-hidden="true" />
      <div className={styles.smallCard} aria-hidden="true" />
      <div className={styles.smallCard} aria-hidden="true" />
    </div>
  )
}
