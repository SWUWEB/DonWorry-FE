import type { ReactNode } from 'react'
import styles from './PrimaryButton.module.css'


type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
}

export default function PrimaryButton({
  children,
  onClick,
}: PrimaryButtonProps) {

  return (
    <button
      className={styles.button}
      onClick={onClick}>
      {children}
    </button>
  )
}