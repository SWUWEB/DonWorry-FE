import { CategoryIcon } from '@/assets/icons/CategoryIcon'
import { formatRemainingTime } from '../../utils/formatTimer'
import { highlightSearch } from '../../utils/highlightSearch'
import type { Product } from '@/features/temptation/types'
import { formatKRW } from '@/shared/utils/currency'
import styles from './SearchProductItem.module.css'
import { useNavigate } from 'react-router-dom'

interface SearchProductItemProps {
  product: Product
  keyword: string
}

export const SearchProductItem = ({ product, keyword }: SearchProductItemProps) => {
  const navigate = useNavigate()
  const { id, name, category, price, time } = product

  const handleClick = () => {
    navigate(`/temptation/${id}`)
  }

  return (
    <button
      type="button"
      className={styles.box}
      onClick={handleClick}
      aria-label={`${name} 상세 보기`}
    >
      <div className={styles.top}>
        <CategoryIcon category={category} size={34} />
        <div className={styles.info}>
          <p className={styles.name}>{highlightSearch(name, keyword)}</p>
          <p className={styles.meta}>
            {category} · {formatKRW(price)}
          </p>
        </div>
      </div>
      <p className={styles.time}>남은 대기 시간 {formatRemainingTime(time)}</p>
    </button>
  )
}
