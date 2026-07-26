import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoChevronBack, IoNotifications, IoPencilOutline } from 'react-icons/io5'
import { PiListBold } from 'react-icons/pi'
import Header from '@/components/layout/Header'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import { MOCK_RECORDS } from '@/features/record/mockRecords'
import { CATEGORIES } from '@/constants/product'
import styles from './RecordDetailPage.module.css'

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const record = MOCK_RECORDS.find((item) => item.id === id)

  useEffect(() => {
    if (!record) {
      navigate('/record', { replace: true })
    }
  }, [record, navigate])

  const [selectedCategory, setSelectedCategory] = useState(record?.category)

  if (!record) return null

  const recentRecords = MOCK_RECORDS.filter(
    (item) => item.category === selectedCategory && item.id !== record.id,
  )

  return (
    <div key={record.id}>
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

        {record.reason && (
          <section className={`${styles.section} ${styles.reasonSection}`}>
            <h2 className={styles.sectionLabel}>사고 싶은 이유</h2>
            <p className={styles.reason}>{record.reason}</p>
          </section>
        )}

        <RecentSpendingList
          count={recentRecords.length}
          records={recentRecords.map((item) => ({
            id: item.id,
            title: item.title,
            date: item.date,
            amount: item.amount,
          }))}
        />
      </div>
    </div>
  )
}
