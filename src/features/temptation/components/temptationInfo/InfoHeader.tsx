import { CategoryIcon } from '@/assets/icons/CategoryIcon'
import type { Category } from '../../types'
import styles from './InfoHeader.module.css'

interface InfoHeaderProps {
  category: Category
  name: string
}

export const InfoHeader = ({ category, name }: InfoHeaderProps) => {
  return (
    <div className={styles.productHeader}>
      <CategoryIcon category={category} size={55} />
      <div className={styles.textGroup}>
        <span className={styles.categoryChip}>{category}</span>
        <h2 className={styles.productName}>{name}</h2>
      </div>
    </div>
  )
}
