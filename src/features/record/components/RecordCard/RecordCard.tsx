import { Link } from 'react-router-dom'
import type { RecordType } from '@/features/record/mockRecords'
import { formatKRW } from '@/shared/utils/currency'
import styles from './RecordCard.module.css'

interface RecordCardProps {
  id: string
  title: string
  category: string
  amount: number
  type: RecordType
  thumbnail?: string
}

export default function RecordCard({
  id,
  title,
  category,
  amount,
  type,
  thumbnail,
}: RecordCardProps) {
  return (
    <Link to={`/record/${id}`} className={styles.card}>
      <div className={styles.left}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.thumbnail} />
        ) : (
          <div className={styles.thumbnailPlaceholder} />
        )}

        <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          <p className={styles.category}>{category}</p>
        </div>
      </div>

      <p className={`${styles.amount} ${type === 'saved' ? styles.saved : styles.consume}`}>
        {type === 'saved' ? '+' : '-'} {formatKRW(amount)}
      </p>
    </Link>
  )
}
