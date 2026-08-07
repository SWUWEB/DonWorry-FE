import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import DrawerMenu from '@/features/drawer/DrawerMenu'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  return (
    <>
      <Suspense fallback={<div className={styles.fallback}><div className={styles.spinner} /></div>}>
        <Outlet />
      </Suspense>
      <DrawerMenu />
    </>
  )
}
