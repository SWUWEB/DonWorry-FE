import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import Notification from '@/features/notification'
import FilterTabs from '@/features/notification/components/FilterTabs'
import NotificationSettingsSheet from '@/features/notification/components/NotificationSettingsSheet'
import type { FilterType } from '@/features/notification/components/FilterTabs'
import styles from './NotificationPage.module.css'

export default function NotificationPage() {
  const [filter, setFilter] = useState<FilterType>('전체')
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <Header
        subTitle="알림"
        subLeft={<HeaderBackButton />}
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
