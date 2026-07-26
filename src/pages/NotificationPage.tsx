import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBack, IoSettingsOutline } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import Notification from '@/features/notification'
import FilterTabs from '@/features/notification/components/FilterTabs'
import NotificationSettingsSheet from '@/features/notification/components/NotificationSettingsSheet'
import type { FilterType } from '@/features/notification/components/FilterTabs'
import styles from './NotificationPage.module.css'

export default function NotificationPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterType>('전체')
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <Header
        subTitle="알림"
        subLeft={
          <button className={styles.iconBtn} aria-label="뒤로가기" onClick={() => navigate(-1)}>
            <IoChevronBack size={20} />
          </button>
        }
        subRight={
          <button className={styles.iconBtn} aria-label="설정" onClick={() => setSheetOpen(true)}>
            <IoSettingsOutline size={20} />
          </button>
        }
        subMain={<FilterTabs active={filter} onChange={setFilter} />}
      />
      <Notification filter={filter} />
      {sheetOpen && <NotificationSettingsSheet onClose={() => setSheetOpen(false)} />}
    </>
  )
}
