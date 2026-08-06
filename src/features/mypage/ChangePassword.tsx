import Header from '@/components/layout/Header'
import { IoChevronBack, IoNotifications, IoMenu } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import ChangePasswordForm from './components/ChangePasswordForm'
import styles from './ChangePassword.module.css'

export default function ChangePassword() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        left={
          <span className={styles.logo}>
            Logo
          </span>
        }

        right={
          <>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="알림"
            >
              <IoNotifications size={20} />
            </button>

            <button
              type="button"
              className={styles.iconButton}
              aria-label="메뉴"
            >
              <IoMenu size={20} />
            </button>
          </>
        }

        subLeft={
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <IoChevronBack size={20} />
          </button>
        }

        subMain={
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              비밀번호 변경
            </h1>

            <p className={styles.pageDescription}>
              프로필 및 계정 정보를 관리하세요.
            </p>
          </div>
        }
      />

      <main className={styles.container}>
        <ChangePasswordForm />
      </main>
    </>
  )
}