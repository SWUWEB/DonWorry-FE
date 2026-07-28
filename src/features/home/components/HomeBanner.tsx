import { getFormattedDateLabel } from '@/shared/utils/date'
import styles from './HomeBanner.module.css'

interface HomeBannerProps {
  goalSet: boolean
  achievementPercent: number | null
}

export default function HomeBanner({ goalSet, achievementPercent }: HomeBannerProps) {
  const dateLabel = getFormattedDateLabel()

  let line1: string
  let line2: string

  if (!goalSet) {
    line1 = '이번 달 절약 목표를'
    line2 = '설정해보세요.'
  } else if (achievementPercent !== null && achievementPercent >= 100) {
    line1 = '이번 달 절약 목표를'
    line2 = '달성했어요! 🎉'
  } else {
    line1 = `이번 달 목표 ${achievementPercent ?? 0}%`
    line2 = '달성했어요 🎯'
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>홈</h1>
        <p className={styles.headerSubtitle}>소비 패턴을 분석하고 목표를 관리하세요.</p>
      </div>

      <div className={styles.body}>
        <p className={styles.date}>{dateLabel}</p>
        <p className={styles.achievement}>
          {line1}
          <br />
          {line2}
        </p>
      </div>
    </section>
  )
}
