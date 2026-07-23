import { getFormattedDateLabel } from '@/shared/utils/date'
import styles from './HomeBanner.module.css'

interface HomeBannerProps {
  achievementPercent: number
}

export default function HomeBanner({ achievementPercent }: HomeBannerProps) {
  const dateLabel = getFormattedDateLabel()

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>홈</h1>
        <p className={styles.headerSubtitle}>소비 패턴을 분석하고 목표를 관리하세요.</p>
      </div>

      <div className={styles.body}>
        <p className={styles.date}>{dateLabel}</p>
        <p className={styles.achievement}>
          이번 달 목표 {achievementPercent}%<br />달성했어요 🎯
        </p>
        <p className={styles.sectionLabel}>이번 달 소비</p>
      </div>
    </section>
  )
}
