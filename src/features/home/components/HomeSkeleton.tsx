import styles from './HomeSkeleton.module.css'

export default function HomeSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={`${styles.line} ${styles.lineLong}`} />
      </div>
      <div className={styles.card} />
      <div className={styles.row}>
        <div className={styles.halfCard} />
        <div className={styles.halfCard} />
      </div>
      <div className={styles.card} />
      <div className={styles.smallCard} />
      <div className={styles.smallCard} />
    </div>
  )
}
