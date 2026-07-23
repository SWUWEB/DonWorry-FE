import styles from './AnswerButton.module.css'

interface AnswerButtonProps {
  emoji?: string
  label: string
  variant: 'outline' | 'filled'
  disabled?: boolean
  onClick?: () => void
}

export default function AnswerButton({
  emoji,
  label,
  variant,
  disabled,
  onClick,
}: AnswerButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${variant === 'filled' ? styles.filled : styles.outline}`}
      disabled={disabled}
      onClick={onClick}
    >
      {emoji ? `${emoji} ${label}` : label}
    </button>
  )
}
