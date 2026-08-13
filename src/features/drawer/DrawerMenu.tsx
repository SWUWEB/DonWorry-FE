import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoCloseOutline } from 'react-icons/io5'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useDrawer } from './useDrawer'
import ProfileIcon from '@/assets/profile.svg'
import styles from './DrawerMenu.module.css'

function LogoutIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.667 11.3333L14.0003 7.99996L10.667 4.66663"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8H6"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 14V8.66667C10 8.48986 9.92976 8.32029 9.80474 8.19526C9.67971 8.07024 9.51014 8 9.33333 8H6.66667C6.48986 8 6.32029 8.07024 6.19526 8.19526C6.07024 8.32029 6 8.48986 6 8.66667V14"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.66667C1.99995 6.47271 2.04222 6.28108 2.12386 6.10514C2.20549 5.92921 2.32453 5.7732 2.47267 5.648L7.13933 1.64867C7.37999 1.44527 7.6849 1.33368 8 1.33368C8.3151 1.33368 8.62001 1.44527 8.86067 1.64867L13.5273 5.648C13.6755 5.7732 13.7945 5.92921 13.8761 6.10514C13.9578 6.28108 14 6.47271 14 6.66667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V6.66667Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MypageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12.6663 14V12.6667C12.6663 11.9594 12.3854 11.2811 11.8853 10.781C11.3852 10.281 10.7069 10 9.99967 10H5.99967C5.29243 10 4.61415 10.281 4.11406 10.781C3.61396 11.2811 3.33301 11.9594 3.33301 12.6667V14"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99967 7.33333C9.47243 7.33333 10.6663 6.13943 10.6663 4.66667C10.6663 3.19391 9.47243 2 7.99967 2C6.52692 2 5.33301 3.19391 5.33301 4.66667C5.33301 6.13943 6.52692 7.33333 7.99967 7.33333Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RecordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 4.66663V14"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.99967 12C1.82286 12 1.65329 11.9298 1.52827 11.8047C1.40325 11.6797 1.33301 11.5101 1.33301 11.3333V2.66667C1.33301 2.48986 1.40325 2.32029 1.52827 2.19526C1.65329 2.07024 1.82286 2 1.99967 2H5.33301C6.04025 2 6.71853 2.28095 7.21863 2.78105C7.71872 3.28115 7.99967 3.95942 7.99967 4.66667C7.99967 3.95942 8.28063 3.28115 8.78072 2.78105C9.28082 2.28095 9.9591 2 10.6663 2H13.9997C14.1765 2 14.3461 2.07024 14.4711 2.19526C14.5961 2.32029 14.6663 2.48986 14.6663 2.66667V11.3333C14.6663 11.5101 14.5961 11.6797 14.4711 11.8047C14.3461 11.9298 14.1765 12 13.9997 12H9.99967C9.46924 12 8.96053 12.2107 8.58546 12.5858C8.21039 12.9609 7.99967 13.4696 7.99967 14C7.99967 13.4696 7.78896 12.9609 7.41389 12.5858C7.03882 12.2107 6.53011 12 5.99967 12H1.99967Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TemptationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.3337 8.66664C13.3337 12 11.0003 13.6666 8.22699 14.6333C8.08177 14.6825 7.92402 14.6802 7.78033 14.6266C5.00033 13.6666 2.66699 12 2.66699 8.66664V3.99997C2.66699 3.82316 2.73723 3.65359 2.86225 3.52857C2.98728 3.40355 3.15685 3.33331 3.33366 3.33331C4.66699 3.33331 6.33366 2.53331 7.49366 1.51997C7.6349 1.39931 7.81456 1.33301 8.00033 1.33301C8.18609 1.33301 8.36576 1.39931 8.50699 1.51997C9.67366 2.53997 11.3337 3.33331 12.667 3.33331C12.8438 3.33331 13.0134 3.40355 13.1384 3.52857C13.2634 3.65359 13.3337 3.82316 13.3337 3.99997V8.66664Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.33337V8.00004"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.6666H8.00667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const NAV_ITEMS = [
  { label: '홈', icon: <HomeIcon />, path: '/' },
  { label: '소비 기록 페이지', icon: <RecordIcon />, path: '/record' },
  { label: '유혹 관리 페이지', icon: <TemptationIcon />, path: '/temptation' },
  { label: '마이페이지', icon: <MypageIcon />, path: '/mypage' },
]

export default function DrawerMenu() {
  const { isOpen, close } = useDrawer()
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const handleClose = () => {
    setShowLogoutConfirm(false)
    close()
  }

  const handleNav = (path: string) => {
    handleClose()
    navigate(path)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff > 50) handleClose()
    touchStartX.current = null
  }

  const handleLogout = () => {
    // TODO: 로그아웃 API 호출 및 토큰/세션 정리 후 이동
    setShowLogoutConfirm(false)
    close()
    navigate('/login')
  }

  return createPortal(
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={handleClose}
      >
        <div
          className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.profileSection}>
            <button className={styles.closeBtn} onClick={handleClose} aria-label="닫기">
              <IoCloseOutline size={20} />
            </button>
            <div className={styles.profileRow}>
              <div className={styles.avatar}>
                <img src={ProfileIcon} alt="프로필" className={styles.avatarIcon} />
              </div>
              <div className={styles.userInfo}>
                {/* TODO: 실제 사용자 이름 및 프로필 이미지 연결 */}
                <p className={styles.userName}>000님,</p>
                <p className={styles.greeting}>
                  오늘도 알뜰한 하루
                  <br />
                  시작해 보세요! 💰
                </p>
              </div>
            </div>
          </div>

          <nav className={styles.nav}>
            {NAV_ITEMS.map(({ label, icon, path }) => {
              const isActive =
                path === '/' ? location.pathname === path : location.pathname.startsWith(path)
              return (
                <button
                  key={label}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={() => handleNav(path)}
                >
                  <span className={`${styles.navIcon} ${isActive ? styles.navIconActive : ''}`}>
                    {icon}
                  </span>
                  <span className={styles.navLabel}>{label}</span>
                </button>
              )
            })}

            <div className={styles.divider} />

            <button
              className={`${styles.navItem} ${styles.logoutItem}`}
              onClick={() => setShowLogoutConfirm(true)}
            >
              <span className={styles.navIcon}>
                <LogoutIcon />
              </span>
              <span className={styles.navLabel}>로그아웃</span>
            </button>
          </nav>

          <p className={styles.footer}>@DonWorry</p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        cancelText="취소"
        confirmText="로그아웃"
        icon={<LogoutIcon size={24} />}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>,
    document.body,
  )
}
