import { Outlet } from 'react-router-dom'
import DrawerMenu from '@/features/drawer/DrawerMenu'

export default function AppLayout() {
  return (
    <>
      <Outlet />
      <DrawerMenu />
    </>
  )
}
