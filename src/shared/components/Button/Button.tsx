import type { ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'filled' | 'outline' | 'danger'

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'filled',
  disabled = false,
  fullWidth = true,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className ?? ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
