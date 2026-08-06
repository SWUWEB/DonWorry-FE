import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoPencilOutline } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import { MOCK_RECORDS } from '@/features/record/mockRecords'
import { formatKRW } from '@/shared/utils/currency'
import styles from './RecordDetailPage.module.css'

// 목데이터의 날짜가 "2026년 4월 17일" 형식이라 상세 화면 표기(YYYY.MM.DD)로 변환합니다.
// API 연결 시 서버에서 포맷된 날짜를 받도록 수정 예정입니다.
function formatDateCompact(dateLabel: string) {
  const match = dateLabel.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return dateLabel

  const [, year, month, day] = match
  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`
}

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const record = MOCK_RECORDS.find((item) => item.id === id)

  useEffect(() => {
    if (!record) {
      navigate('/record', { replace: true })
    }
  }, [record, navigate])

  if (!record) return null

  const recentRecords = MOCK_RECORDS.filter(
    (item) => item.category === record.category && item.id !== record.id,
  )

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
