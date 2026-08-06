import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { useNavigate } from 'react-router-dom'
import styles from './GoalAmount.module.css'

import CurrentGoalCard from './components/CurrentGoalCard'
import GoalSettingCard from './components/GoalSettingCard'

export default function GoalAmount() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
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
