import type { ReactNode } from 'react'
import styles from './SavingCategoryItem.module.css'

interface SavingCategoryItemProps {
  icon: ReactNode
  name: string
  defense: number
  saved: string
  spent: string
}

export default function SavingCategoryItem({
  icon,
  name,
  defense,
  saved,
  spent,
}: SavingCategoryItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <div className={styles.left}>
          <span className={styles.icon}>{icon}</span>

          <span className={styles.name}>{name}</span>
        </div>

        <span className={styles.badge}>방어율 {defense}%</span>
      </div>

      <div className={styles.amountRow}>
        <div>
          <span className={styles.label}>참은 금액 </span>
          <span className={styles.money}>₩{saved}</span>
        </div>

        <div>
          <span className={styles.label}>소비 금액 </span>
          <span className={styles.money}>₩{spent}</span>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${defense}%` }} />
      </div>
    </div>
  )
}
