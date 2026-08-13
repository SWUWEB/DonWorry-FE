import { formatKRW } from '@/shared/utils/currency'
import styles from './ProductSummaryCard.module.css'
import type { Category } from '../../types'

interface ProductSummaryCardProps {
  category: Category
  name: string
  price: number
  savedMode?: boolean
}

export const ProductSummaryCard = ({
  category,
  name,
  price,
  savedMode = false,
}: ProductSummaryCardProps) => {
  return (
    <div className={styles.card}>
      <span className={styles.categoryChip}>{category}</span>
      <p className={styles.name}>{name}</p>
      {savedMode ? (
        <p className={styles.savedPrice}>+{formatKRW(price)} 절약</p>
      ) : (
        <p className={styles.price}>{formatKRW(price)}</p>
      )}
    </div>
  )
}
