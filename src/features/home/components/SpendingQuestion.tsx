import { useNavigate } from 'react-router-dom'
import { getDayIndex } from '@/shared/utils/date'
import styles from './SpendingQuestion.module.css'

const QUESTIONS = [
  '오늘 계획하지 않은 소비가 있었나요?',
  '오늘 꼭 필요하지 않은 물건을 사지는 않았나요?',
  '오늘 참아낸 소비가 있었나요?',
  '오늘 충동적으로 소비한 것이 있었나요?',
  '오늘 소비를 줄일 수 있었던 순간이 있었나요?',
  '오늘 지출 목록을 돌아보셨나요?',
  '오늘 예산 내에서 소비했나요?',
]

export default function SpendingQuestion() {
  const navigate = useNavigate()
  const question = QUESTIONS[getDayIndex(QUESTIONS.length)]

  return (
    <div
      className={styles.card}
      onClick={() => navigate('/record')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate('/record')
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.iconWrapper}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#389698" strokeWidth="1.8" />
          <path
            d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
            stroke="#389698"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="0.8" fill="#389698" />
        </svg>
      </div>
      <div>
        <p className={styles.cardLabel}>오늘의 소비 질문</p>
        <p className={styles.cardText}>{question}</p>
      </div>
    </div>
  )
}
