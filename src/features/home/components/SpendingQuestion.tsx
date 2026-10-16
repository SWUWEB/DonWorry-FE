import { useNavigate } from 'react-router-dom'
import styles from './SpendingQuestion.module.css'

interface SpendingQuestionProps {
  question: string
}

export default function SpendingQuestion({ question }: SpendingQuestionProps) {
  const navigate = useNavigate()

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
