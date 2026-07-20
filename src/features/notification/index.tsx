import { useEffect, useRef, useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import NotificationCard from './components/NotificationCard'
import type { FilterType } from './components/FilterTabs'
import { useNotifications } from './hooks/useNotifications'
import styles from './Notification.module.css'
import type { NotificationItem } from './components/NotificationCard'

type SortType = '최신순' | '오래된순' | '읽지 않은 알림 우선'
const SORT_OPTIONS: SortType[] = ['최신순', '오래된순', '읽지 않은 알림 우선']

interface NotificationProps {
  filter: FilterType
  onUnreadCountChange?: (count: number) => void
}

export default function Notification({ filter, onUnreadCountChange }: NotificationProps) {
  const [sort, setSort] = useState<SortType>('최신순')
  const [sortOpen, setSortOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<number>>(new Set())
  const sortRef = useRef<HTMLDivElement>(null)

  const { data: serverNotifications = [] } = useNotifications()

  const notifications: NotificationItem[] = serverNotifications.map(n => ({
    ...n,
    isRead: readIds.has(n.id) ? true : n.isRead,
  }))

  const unreadCount = notifications.filter(n => !n.isRead).length
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

  const filtered = filter === '전체'
    ? notifications
    : notifications.filter(n => n.type === filter)

  const sorted = [...filtered].sort((a, b) => {
    if (sort === '오래된순') return a.id - b.id
    if (sort === '읽지 않은 알림 우선') {
      if (a.isRead === b.isRead) return b.id - a.id
      return a.isRead ? 1 : -1
    }
    return b.id - a.id
  })

  const handleRead = (id: number) => {
    setReadIds(prev => new Set([...prev, id]))
  }

  return (
    <main className={styles.main}>
      <div className={styles.sortRow}>
        <div className={styles.sortWrap} ref={sortRef}>
          <button className={styles.sortBtn} onClick={() => setSortOpen(prev => !prev)}>
            {sort}
            <IoChevronDown size={16} className={sortOpen ? styles.iconUp : ''} />
          </button>
          {sortOpen && (
            <div className={styles.sortDropdown}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`${styles.sortOption} ${sort === opt ? styles.sortOptionActive : ''}`}
                  onClick={() => { setSort(opt); setSortOpen(false) }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ul className={styles.list}>
        {sorted.map(item => (
          <li key={item.id}>
            <NotificationCard {...item} onRead={handleRead} />
          </li>
        ))}
        {sorted.length === 0 && (
          <p className={styles.empty}>알림이 없습니다.</p>
        )}
      </ul>
    </main>
  )
}
