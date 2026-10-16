import { useNavigate } from 'react-router-dom'
import styles from './BackButton.module.css'

interface BackButtonProps {
  onClick?: () => void
}

export default function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className={styles.backButton}
      onClick={onClick ?? (() => navigate(-1))}
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
  )
}
