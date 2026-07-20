import type { ReactNode } from 'react'
import styles from './PrimaryButton.module.css'


type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
}: PrimaryButtonProps) {

  return (
    <button
      type={type}
      className={styles.button}
      onClick={onClick}>
      {children}
    </button>
  )
}