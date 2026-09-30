import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { IoPencilOutline } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import { useConsumptionRecordDetail } from '@/features/record/hooks/useConsumptionRecords'
import { formatKRW } from '@/shared/utils/currency'
import { formatDateCompact } from '@/shared/utils/date'
import Skeleton, { SkeletonGroup } from '@/shared/components/Skeleton'
import styles from './RecordDetailPage.module.css'

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
    return (
      <SkeletonGroup label="소비 기록 불러오는 중">
        <Header
          onBellClick={() => navigate('/notification')}
          subLeft={<HeaderBackButton />}
          subTitle="소비 상세"
          subMain={
            <div className={styles.summary}>
              <div className={styles.titleRow}>
                <Skeleton width={56} height={22} radius={11} />
                <Skeleton width={140} height={20} />
              </div>
              <Skeleton width={150} height={28} />
              <Skeleton width={100} height={14} />
            </div>
          }
        />
        <div className={styles.content}>
          <div className={styles.skeletonSection}>
            <Skeleton width={100} height={16} />
            <Skeleton height={60} radius={12} />
          </div>
          <div className={styles.skeletonSection}>
            <Skeleton width={160} height={16} />
            <Skeleton height={52} radius={12} />
            <Skeleton height={52} radius={12} />
          </div>
        </div>
      </SkeletonGroup>
    )
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
          <button
            type="button"
            aria-label="수정"
            onClick={() => navigate(`/record/${record.id}/edit`)}
          >
            <IoPencilOutline size={20} />
          </button>
        }
        subMain={
          <div className={styles.summary}>
            <div className={styles.titleRow}>
              <span className={styles.categoryBadge}>{record.category}</span>
              <p className={styles.title}>{record.title}</p>
            </div>

            <p className={`${styles.amount} ${record.type === 'consume' ? styles.consume : ''}`}>
              {record.type === 'saved' ? '+' : '-'} {formatKRW(record.amount)}
            </p>
            <p className={styles.date}>{formatDateCompact(record.occurredAt)}</p>
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
          count={record.recentCategoryConsumptionCount}
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
