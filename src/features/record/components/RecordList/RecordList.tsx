import styles from './RecordList.module.css'
import DateSection from '../DateSection'
import RecordCard from '../RecordCard'
import { useConsumptionRecords } from '@/features/record/hooks/useConsumptionRecords'
import type { RecordType } from '@/features/record/mockRecords'

export type FilterValue = 'all' | RecordType

interface RecordListProps {
  filter: FilterValue
}

export default function RecordList({ filter }: RecordListProps) {
  const { data, isLoading, isError, refetch } = useConsumptionRecords(filter)

  if (isLoading) {
    return <p className={styles.message}>불러오는 중...</p>
  }

  if (isError) {
    return (
      <div className={styles.message}>
        <p>소비 기록을 불러오지 못했습니다.</p>
        <button type="button" className={styles.retryButton} onClick={() => refetch()}>
          다시 시도
        </button>
      </div>
    )
  }

  const records = data ?? []
  const dates = Array.from(new Set(records.map((record) => record.date)))

  if (dates.length === 0) {
    return <p className={styles.message}>기록이 없습니다.</p>
  }

  return (
    <div className={styles.container}>
      {dates.map((date) => (
        <DateSection key={date} date={date}>
          {records
            .filter((record) => record.date === date)
            .map((record) => (
              <RecordCard
                key={record.id}
                id={record.id}
                title={record.title}
                category={record.category}
                amount={record.amount}
                type={record.type}
                thumbnail={record.thumbnail}
              />
            ))}
        </DateSection>
      ))}
    </div>
  )
}
