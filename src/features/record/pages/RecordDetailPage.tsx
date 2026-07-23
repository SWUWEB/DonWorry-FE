import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoChevronBack, IoNotifications, IoPencilOutline } from 'react-icons/io5'
import { PiListBold } from 'react-icons/pi'
import Header from '@/components/layout/Header'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import type { RecentSpendingItem } from '@/features/intervention/components/RecentSpendingList'
import { CATEGORIES } from '@/constants/product'
import styles from './RecordDetailPage.module.css'

interface RecordDetail {
  title: string
  amount: number
  category: string
  reason: string
  type: 'saved' | 'consume'
}

// 하드코딩됨. API 연결 시 id로 실제 데이터 조회하도록 수정 예정
const MOCK_RECORDS: Record<string, RecordDetail> = {
  '1': {
    title: '투썸플레이스 신봉점',
    amount: 6100,
    category: '카페/디저트',
    reason: '스트레스 받아서',
    type: 'saved',
  },
  '2': {
    title: 'ZARA 반팔티',
    amount: 23900,
    category: '패션',
    reason: '계절이 바뀌어서',
    type: 'consume',
  },
  '3': {
    title: '무신사',
    amount: 35000,
    category: '패션',
    reason: '세일해서',
    type: 'saved',
  },
}

// 하드코딩됨. API 연결 시 수정 예정
const RECENT_RECORDS: RecentSpendingItem[] = [
  { id: '1', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
  { id: '2', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
  { id: '3', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
]

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const record = (id && MOCK_RECORDS[id]) || MOCK_RECORDS['1']
  const [selectedCategory, setSelectedCategory] = useState(record.category)

  return (
    <div>
      <Header
        left={
          <button type="button" aria-label="로고">
            Logo
          </button>
        }
        right={
          <>
            <button type="button" aria-label="알림">
              <IoNotifications />
            </button>
            <button type="button" aria-label="메뉴 열기">
              <PiListBold />
            </button>
          </>
        }
        subLeft={
          <button type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}>
            <IoChevronBack size={20} />
          </button>
        }
        subTitle="소비 상세"
        subRight={
          <button type="button" aria-label="수정">
            <IoPencilOutline size={20} />
          </button>
        }
        subMain={
          <div className={styles.summary}>
            <p className={styles.title}>{record.title}</p>
            <p className={`${styles.amount} ${record.type === 'consume' ? styles.consume : ''}`}>
              {record.type === 'saved' ? '+' : '-'} {record.amount.toLocaleString('ko-KR')} 원
            </p>
          </div>
        }
      />

      <div className={styles.content}>
        <section className={`${styles.section} ${styles.categorySection}`}>
          <h2 className={styles.sectionLabel}>카테고리</h2>
          <div className={styles.chipGroup}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles.chip} ${category === selectedCategory ? styles.chipSelected : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.reasonSection}`}>
          <h2 className={styles.sectionLabel}>사고 싶은 이유</h2>
          <p className={styles.reason}>{record.reason}</p>
        </section>

        <RecentSpendingList count={RECENT_RECORDS.length} records={RECENT_RECORDS} />
      </div>
    </div>
  )
}
