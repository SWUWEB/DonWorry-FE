import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Home from '@/features/home'
import { useNotifications } from '@/features/notification/hooks/useNotifications'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: notifications } = useNotifications()
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        unreadCount={unreadCount}
      />
      <Home />
    </>
  )
}
