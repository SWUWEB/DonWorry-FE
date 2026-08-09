import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { IoPencilOutline } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import { useConsumptionRecordDetail } from '@/features/record/hooks/useConsumptionRecords'
import { formatKRW } from '@/shared/utils/currency'
import styles from './RecordDetailPage.module.css'

// 서버가 내려주는 날짜(occurredAt)를 "YYYY년 M월 D일" 형식으로 받은 뒤,
// 상세 화면 표기(YYYY.MM.DD)로 다시 변환합니다.
function formatDateCompact(dateLabel: string) {
  const match = dateLabel.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return dateLabel

  const [, year, month, day] = match
  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`
}

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: record, isLoading, isError, error, refetch } = useConsumptionRecordDetail(id)
  const isNotFound = isAxiosError(error) && error.response?.status === 404

  useEffect(() => {
    if (isNotFound) {
      navigate('/record', { replace: true })
    }
  }, [isNotFound, navigate])

  if (isLoading) {
    return <p className={styles.message}>불러오는 중...</p>
  }

  if (isNotFound) return null

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

  if (!record) return null

  return (
    <div>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
        subTitle="소비 상세"
        subRight={
          <button type="button" aria-label="수정">
            <IoPencilOutline size={20} />
          </button>
        }
        subMain={
          <div className={styles.summary}>
            <div className={styles.titleRow}>
              <span className={styles.categoryBadge}>{record.category}</span>
              <p className={styles.title}>{record.title}</p>
            </div>

            <div className={styles.amountRow}>
              <p className={`${styles.amount} ${record.type === 'consume' ? styles.consume : ''}`}>
                {record.type === 'saved' ? '+' : '-'} {formatKRW(record.amount)}
              </p>
              <p className={styles.date}>{formatDateCompact(record.date)}</p>
            </div>
          </div>
        }
      />

      <div className={styles.content}>
        {record.reason && (
          <section className={`${styles.section} ${styles.reasonSection}`}>
            <h2 className={styles.sectionLabel}>사고 싶은 이유</h2>
            <p className={styles.reason}>{record.reason}</p>
          </section>
        )}

        <RecentSpendingList
          count={record.recentCategoryConsumptions.length}
          records={record.recentCategoryConsumptions.map((item) => ({
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
