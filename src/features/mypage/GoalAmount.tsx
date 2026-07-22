import Header from '@/components/layout/Header'
import {IoChevronBack, IoNotifications, IoMenu,} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import styles from './GoalAmount.module.css'

import CurrentGoalCard from './components/CurrentGoalCard'
import GoalSettingCard from './components/GoalSettingCard'

export default function GoalAmount() {
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
            <h1 className={styles.pageTitle}>목표 금액 설정</h1>

            <p className={styles.pageDescription}>
              목표 금액을 설정하고 달성 현황을 확인하세요.
            </p>
          </div>
        }
      />

      <main className={styles.container}>
        <CurrentGoalCard
          goalAmount={1000000}
          achievedAmount={600000}
        />

        <GoalSettingCard />
      </main>
    </>
  )
}