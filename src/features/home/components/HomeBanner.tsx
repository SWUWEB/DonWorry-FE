import styles from './HomeBanner.module.css'

export default function HomeBanner() {
  const today = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dateLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 ${days[today.getDay()]}요일`

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>홈</h1>
        <p className={styles.headerSubtitle}>소비 패턴을 분석하고 목표를 관리하세요.</p>
      </div>

      <div className={styles.body}>
        <p className={styles.date}>{dateLabel}</p>
        <p className={styles.achievement}>
          이번 달 목표 70%<br />달성했어요 🎯
        </p>
        <p className={styles.sectionLabel}>이번 달 소비</p>
      </div>
    </section>
  )
}
