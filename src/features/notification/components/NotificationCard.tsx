import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IoFlash,
  IoCheckmark,
  IoCalendarOutline,
  IoHeartSharp,
  IoEllipsisVertical,
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
  { bg: string; color: string; Icon: IconType }
> = {
  lightning: { bg: '#FFF5CC', color: '#C88A00', Icon: IoFlash },
  check:     { bg: '#EDE9FE', color: '#6D28D9', Icon: IoCheckmark },
  calendar:  { bg: '#F0F0F0', color: '#666666', Icon: IoCalendarOutline },
  heart:     { bg: '#FFE4E4', color: '#E05353', Icon: IoHeartSharp },
}

interface Props extends NotificationItem {
  onRead: (id: number) => void
}

export default function NotificationCard({ id, title, description, time, iconVariant, isRead, onRead }: Props) {
  const { bg, color, Icon } = ICON_CONFIG[iconVariant]
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
    setMenuOpen(prev => !prev)
  }

  return (
    <div
      className={`${styles.card} ${isRead ? styles.read : ''}`}
      onClick={() => onRead(id)}
    >
      <div className={styles.iconWrap} style={{ background: bg }}>
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

      {menuOpen && createPortal(
        <div
          className={styles.dropdown}
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          <button className={styles.dropdownItem} onClick={e => { e.stopPropagation(); setMenuOpen(false) }}>
            삭제하기
          </button>
          <button className={styles.dropdownItem} onClick={e => { e.stopPropagation(); setMenuOpen(false) }}>
            알람끄기
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}
