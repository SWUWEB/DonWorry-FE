import styles from './EncouragementCard.module.css'

const MESSAGES = [
  '아직 시작 단계예요. 지금부터 조금씩 줄여볼까요?',
  '작은 소비를 한 번 참는 것도 좋은 변화예요.',
  '오늘도 목표를 향해 한 걸음 나아가고 있어요.',
  '절약은 작은 습관에서 시작돼요. 오늘도 잘 하고 있어요!',
  '지출을 돌아보는 것만으로도 충분히 잘 하고 있어요.',
  '목표를 세운 것 자체가 이미 훌륭한 시작이에요.',
  '오늘 하루도 현명한 소비를 위해 노력하고 있어요.',
]

function getDayIndex(length: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return dayOfYear % length
}

export default function EncouragementCard() {
  const message = MESSAGES[getDayIndex(MESSAGES.length)]

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
