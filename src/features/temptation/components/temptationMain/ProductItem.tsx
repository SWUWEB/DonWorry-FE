import { IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { formatRemainingTime } from '../../utils/formatTimer'
import type { Product } from '@/features/temptation/types'
import { formatKRW } from '@/shared/utils/currency'
import styles from './ProductItem.module.css'

interface ProductItemProps {
  product?: Product
  onDelete?: (id: string) => void
}

export const ProductItem = ({ product, onDelete }: ProductItemProps) => {
  const navigate = useNavigate()

  // 빈 슬롯
  if (!product) {
    return (
      <div className={`${styles.itemContainer} ${styles.empty}`}>
        <div className={styles.itemMain}>
          <p className={styles.itemName}>(제품 이름)</p>
          <div className={styles.itemBottom}>
            <span className={styles.itemPrice}>-원</span>
            <span className={styles.itemTimer}>남은 대기 시간 --:--</span>
          </div>
        </div>
        <span className={styles.deleteBtn} aria-hidden="true">
          <IoClose size={20} />
        </span>
      </div>
    )
  }

  const { id, name, price, time } = product

  return (
    <div className={styles.itemContainer}>
      <button
        type="button"
        className={styles.itemMain}
        onClick={() => navigate(`/temptation/${id}`)}
        aria-label={`${name} 상세 보기`}
      >
        <p className={styles.itemName}>{name}</p>
        <div className={styles.itemBottom}>
          <span className={styles.itemPrice}>{formatKRW(price)}</span>
          <span className={styles.itemTimer}>남은 대기 시간 {formatRemainingTime(time)}</span>
        </div>
      </button>
      <button
        type="button"
        className={styles.deleteBtn}
        aria-label={`${name} 삭제`}
        onClick={() => onDelete?.(id)}
      >
        <IoClose size={20} />
      </button>
    </div>
  )
}
