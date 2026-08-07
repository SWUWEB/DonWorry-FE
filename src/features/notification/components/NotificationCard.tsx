import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IoFlash,
  IoCheckmark,
  IoCalendarOutline,
  IoHeartSharp,
  IoEllipsisVertical,
  IoTrashOutline,
  IoNotificationsOffOutline,
} from 'react-icons/io5'
import type { IconType } from 'react-icons'
import styles from './NotificationCard.module.css'
import type { FilterType } from './FilterTabs'

export interface NotificationItem {
  id: number
  type: Exclude<FilterType, '전체'>
  iconVariant: 'lightning' | 'check' | 'calendar' | 'heart'
  title: string
  description: string
  time: string
  isRead: boolean
}

const ICON_CONFIG: Record<
  NotificationItem['iconVariant'],
  { bg: string; color: string; border: string; Icon: IconType }
> = {
  // 목표 달성 - 성취/성공을 나타내는 그린 계열
  check: { bg: '#D1FAE5', color: '#059669', border: '#6EE7B7', Icon: IoCheckmark },
  // 유혹관리: 새 유혹(위시리스트) 추가 - 하트와 어울리는 로즈/핑크 계열
  heart: { bg: '#FCE7F3', color: '#DB2777', border: '#F9A8D4', Icon: IoHeartSharp },
  // 월간 리포트 등 일반 알림 - 차분한 바이올렛 계열
  calendar: { bg: '#EDE9FE', color: '#7C3AED', border: '#C4B5FD', Icon: IoCalendarOutline },
  // 유혹관리: 대기 시간 종료(재판단 임박) - 주의를 환기하는 앰버 계열
  lightning: { bg: '#FEF3C7', color: '#D97706', border: '#FCD34D', Icon: IoFlash },
}

interface Props extends NotificationItem {
  onRead: (id: number) => void
}

export default function NotificationCard({
  id,
  title,
  description,
  time,
  iconVariant,
  isRead,
  onRead,
}: Props) {
  const { bg, color, border, Icon } = ICON_CONFIG[iconVariant]
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setMenuOpen((prev) => !prev)
  }

  return (
    <div
      className={`${styles.card} ${isRead ? styles.read : ''}`}
      onClick={() => onRead(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onRead(id)
      }}
    >
      <div className={styles.iconWrap} style={{ background: bg, border: `1px solid ${border}` }}>
        <Icon size={20} color={color} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{title}</span>
          <span className={styles.time}>{time}</span>
          <div className={styles.moreWrap}>
            <button
              ref={btnRef}
              className={styles.moreBtn}
              aria-label="더보기"
              onClick={handleMoreClick}
            >
              <IoEllipsisVertical size={18} />
            </button>
          </div>
        </div>
        <p className={styles.description}>{description}</p>
      </div>

      {menuOpen &&
        createPortal(
          <div className={styles.dropdown} style={{ top: menuPos.top, right: menuPos.right }}>
            <button
              className={styles.dropdownItem}
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
              }}
            >
              <IoTrashOutline size={16} />
              삭제하기
            </button>
            <button
              className={styles.dropdownItem}
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
              }}
            >
              <IoNotificationsOffOutline size={16} />
              알람끄기
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}
