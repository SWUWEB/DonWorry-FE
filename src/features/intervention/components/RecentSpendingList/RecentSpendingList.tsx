import styles from './RecentSpendingList.module.css'

export interface RecentSpendingItem {
  id: string
  title: string
  date: string
  amount: number
}

interface RecentSpendingListProps {
  count: number
  records: RecentSpendingItem[]
}

export default function RecentSpendingList({ count, records }: RecentSpendingListProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>최근 해당 카테고리 소비 : {count}회</p>

      <div className={styles.list}>
        {records.map((record) => (
          <div key={record.id} className={styles.item}>
            <div className={styles.left}>
              <div className={styles.thumbnail} />

              <div className={styles.info}>
                <p className={styles.itemTitle}>{record.title}</p>
                <p className={styles.date}>{record.date}</p>
              </div>
            </div>

            <p className={styles.amount}>- {record.amount.toLocaleString('ko-KR')} 원</p>
          </div>
        ))}
      </div>
    </div>
  )
}
