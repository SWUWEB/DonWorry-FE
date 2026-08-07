import { useNow } from '../../hooks/useNow'
import { formatDetailTimer } from '../../utils/formatDetailTimer'
import { remainPercent } from '../../utils/remainPercent'
import styles from './RemainingTime.module.css'

interface RemainingTimeProps {
  deadline: Date
  createdAt?: Date
}

export const RemainingTime = ({ deadline, createdAt }: RemainingTimeProps) => {
  useNow(1000)

  const percent = remainPercent(deadline, createdAt ?? null)

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>남은 고민 시간</span>
      <span className={styles.time}>{formatDetailTimer(deadline)}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
