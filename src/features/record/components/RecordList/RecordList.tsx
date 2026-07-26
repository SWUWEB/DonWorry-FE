import styles from './RecordList.module.css'
import DateSection from '../DateSection'
import RecordCard from '../RecordCard'
import { MOCK_RECORDS } from '@/features/record/mockRecords'
import type { RecordType } from '@/features/record/mockRecords'

export type FilterValue = 'all' | RecordType

interface RecordListProps {
  filter: FilterValue
}

export default function RecordList({ filter }: RecordListProps) {
  const filtered =
    filter === 'all' ? MOCK_RECORDS : MOCK_RECORDS.filter((record) => record.type === filter)

  const dates = Array.from(new Set(filtered.map((record) => record.date)))

  return (
    <div className={styles.container}>
      {dates.map((date) => (
        <DateSection key={date} date={date}>
          {filtered
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
