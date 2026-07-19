import styles from './AnswerButton.module.css'

interface AnswerButtonProps {
  emoji: string
  label: string
  variant: 'outline' | 'filled'
  onClick?: () => void
}

export default function AnswerButton({ emoji, label, variant, onClick }: AnswerButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${variant === 'filled' ? styles.filled : styles.outline}`}
      onClick={onClick}
    >
      {emoji} {label}
    </button>
  )
}
