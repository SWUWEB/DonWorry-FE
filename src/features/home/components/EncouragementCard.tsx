import styles from './EncouragementCard.module.css'

interface EncouragementCardProps {
  message: string
}

export default function EncouragementCard({ message }: EncouragementCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"
            stroke="#389698"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
            stroke="#389698"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className={styles.cardLabel}>오늘의 응원 메시지</p>
        <p className={styles.cardText}>{message}</p>
      </div>
    </div>
  )
}
