import coinCharacter from '@/assets/images/coin_character.png'
import { formatKRW } from '@/shared/utils/currency'
import { getFormattedDateLabel } from '@/shared/utils/date'
import type { GoalAchievementStatus } from '../types'
import styles from './HomeBanner.module.css'

interface HomeBannerProps {
  goalStatus: GoalAchievementStatus
  achievementRate: number
  remainingAmount: number | null
}

export default function HomeBanner({
  goalStatus,
  achievementRate,
  remainingAmount,
}: HomeBannerProps) {
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
      <div className={styles.text}>
        <p className={styles.date}>{dateLabel}</p>
        <p className={styles.achievement}>
          {line1}
          <br />
          {line2}
        </p>
        {goalStatus === 'IN_PROGRESS' && remainingAmount !== null && (
          <p className={styles.remaining}>
            목표까지{' '}
            <strong className={styles.remainingAmount}>{formatKRW(remainingAmount)}</strong>{' '}
            남았어요
          </p>
        )}
      </div>
      <img src={coinCharacter} alt="" className={styles.character} />
    </section>
  )
}
