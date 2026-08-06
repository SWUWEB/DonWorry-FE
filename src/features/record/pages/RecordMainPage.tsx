import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiPlus } from 'react-icons/bi'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import SummaryCard from '@/features/record/components/SummaryCard'
import TabGroup from '@/shared/components/TabGroup'
import RecordList from '@/features/record/components/RecordList'
import type { FilterValue } from '@/features/record/components/RecordList'
import styles from '../styles/RecordMainPage.module.css'

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: '전체', value: 'all' },
  { label: '참은 소비', value: 'saved' },
  { label: '소비', value: 'consume' },
]

export default function RecordMainPage() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <Header
        left={
          <button type="button" aria-label="로고">
            Logo
          </button>
        }
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
        subTitle="소비 기록"
        subMain={<SummaryCard />}
      />

      <div className={styles.filterSection}>
        <TabGroup<FilterValue> options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {/* Record List */}
      <RecordList filter={filter} />

      <button
        type="button"
        className={styles.addBtn}
        aria-label="소비 기록 추가"
        onClick={() => navigate('/record/new')}
      >
        <BiPlus size={32} />
      </button>
    </div>
  )
}
