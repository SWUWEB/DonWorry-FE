import BackButton from '@/features/intervention/components/BackButton'
import styles from './InterventionHeader.module.css'

interface InterventionHeaderProps {
  step: number
  totalSteps: number
}

export default function InterventionHeader({ step, totalSteps }: InterventionHeaderProps) {
  const progress = ((step - 1) / totalSteps) * 100

  return (
    <div className={styles.card}>
      <BackButton />

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
