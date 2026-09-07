import { useEffect, useRef, useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { isUnauthorizedError } from '@/shared/utils/isUnauthorizedError'
import NotificationCard from './components/NotificationCard'
import type { FilterType } from './components/FilterTabs'
import {
  useNotifications,
  useReadNotification,
  useDeleteNotification,
} from './hooks/useNotifications'
import styles from './Notification.module.css'
import type { NotificationItem } from './components/NotificationCard'

type SortType = '최신순' | '오래된순' | '읽지 않은 알림 우선'
const SORT_OPTIONS: SortType[] = ['최신순', '오래된순', '읽지 않은 알림 우선']

const FILTER_MAP: Record<FilterType, string> = {
  전체: 'ALL',
  유혹관리: 'TEMPTATION',
  목표현황: 'GOAL',
  일반: 'GENERAL',
}

const SORT_MAP: Record<SortType, string> = {
  최신순: 'LATEST',
  오래된순: 'OLDEST',
  '읽지 않은 알림 우선': 'UNREAD_FIRST',
}

interface NotificationProps {
  filter: FilterType
  onUnreadCountChange?: (count: number) => void
  onUnauthorized?: () => void
}

export default function Notification({
  filter,
  onUnreadCountChange,
  onUnauthorized = () => {},
}: NotificationProps) {
  const [sort, setSort] = useState<SortType>('최신순')
  const [sortOpen, setSortOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const sortRef = useRef<HTMLDivElement>(null)

  const {
    data: serverNotifications = [],
    isLoading,
    isError,
    error: notificationsError,
    refetch,
  } = useNotifications(FILTER_MAP[filter], SORT_MAP[sort])
  const { mutate: readOne, error: readError } = useReadNotification()
  const { mutate: deleteNotification, error: deleteError } = useDeleteNotification()

  const notifications: NotificationItem[] = serverNotifications.map((n) => ({
    ...n,
    isRead: readIds.has(n.id) ? true : n.isRead,
  }))

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const isUnauthorized =
    isUnauthorizedError(notificationsError) ||
    isUnauthorizedError(readError) ||
    isUnauthorizedError(deleteError)
  useEffect(() => {
    onUnreadCountChange?.(unreadCount)
  }, [unreadCount, onUnreadCountChange])

  useEffect(() => {
    if (!sortOpen) return
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [sortOpen])

  const handleRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]))
    // 실패하면 서버는 읽지 않음인데 화면만 읽음으로 남으므로 로컬 표시를 되돌립니다.
    readOne(id, {
      onError: () =>
        setReadIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        }),
    })
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.sortRow}>
          <div className={styles.sortWrap} ref={sortRef}>
            <button className={styles.sortBtn} onClick={() => setSortOpen((prev) => !prev)}>
              {sort}
              <IoChevronDown size={16} className={sortOpen ? styles.iconUp : ''} />
            </button>
            {sortOpen && (
              <div className={styles.sortDropdown}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`${styles.sortOption} ${sort === opt ? styles.sortOptionActive : ''}`}
                    onClick={() => {
                      setSort(opt)
                      setSortOpen(false)
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <ul className={styles.list}>
          {isLoading && <li className={styles.empty}>알림을 불러오는 중...</li>}
          {isError && (
            <li className={styles.empty}>
              <p>알림을 불러오지 못했습니다.</p>
              <button type="button" className={styles.retryButton} onClick={() => refetch()}>
                다시 시도
              </button>
            </li>
          )}
          {!isLoading &&
            !isError &&
            notifications.map((item) => (
              <li key={item.id}>
                <NotificationCard {...item} onRead={handleRead} onDelete={deleteNotification} />
              </li>
            ))}
          {!isLoading && !isError && notifications.length === 0 && (
            <li className={styles.empty}>알림이 없습니다.</li>
          )}
        </ul>
      </main>

      <ConfirmDialog
        isOpen={isUnauthorized}
        title="로그인이 필요합니다."
        description="로그인 후 다시 이용해주세요."
        confirmText="로그인하기"
        onlyConfirm
        onCancel={onUnauthorized}
        onConfirm={onUnauthorized}
      />
    </>
  )
}
