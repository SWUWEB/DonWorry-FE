import { getFormattedDateLabel } from '@/shared/utils/date'
import type { GoalAchievementStatus } from '../types'
import styles from './HomeBanner.module.css'

interface HomeBannerProps {
  goalStatus: GoalAchievementStatus
  achievementRate: number
}

export default function HomeBanner({ goalStatus, achievementRate }: HomeBannerProps) {
  const dateLabel = getFormattedDateLabel()

  let line1: string
  let line2: string

  if (goalStatus === 'NOT_SET') {
    line1 = '이번 달 절약 목표를'
    line2 = '설정해보세요.'
  } else if (goalStatus === 'ACHIEVED') {
    line1 = '이번 달 절약 목표를'
    line2 = '달성했어요! 🎉'
  } else {
    line1 = `이번 달 목표 ${achievementRate}%`
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
