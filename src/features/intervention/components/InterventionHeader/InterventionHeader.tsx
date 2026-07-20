import { useNavigate } from 'react-router-dom'
import styles from './InterventionHeader.module.css'

interface InterventionHeaderProps {
  step: number
  totalSteps: number
}

export default function InterventionHeader({ step, totalSteps }: InterventionHeaderProps) {
  const navigate = useNavigate()
  const progress = ((step - 1) / totalSteps) * 100

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <h1 className={styles.title}>잠깐만요 👀</h1>
      <p className={styles.subtitle}>이 소비 정말 필요한가요?</p>

      <div className={styles.progressRow}>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={step - 1}
          aria-valuetext={`${totalSteps}개 중 ${step - 1}개 질문 완료`}
        >
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <span className={styles.progressLabel} aria-hidden="true">
          {step - 1}/{totalSteps}
        </span>
      </div>
    </div>
  )
}
