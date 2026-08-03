import Header from '@/components/layout/Header'
import {
  IoChevronBack,
  IoNotifications,
  IoMenu,
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import WithdrawForm from './components/WithdrawForm'
import styles from './Withdraw.module.css'

export default function Withdraw() {
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
              회원 탈퇴
            </h1>

            <p className={styles.pageDescription}>
              탈퇴 전 아래 내용을 꼭 확인해주세요.
            </p>
          </div>
        }
      />

      <main className={styles.container}>
        <WithdrawForm />
      </main>
    </>
  )
}