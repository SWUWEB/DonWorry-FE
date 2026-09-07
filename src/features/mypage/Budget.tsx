import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { useNavigate } from 'react-router-dom'
import styles from './Budget.module.css'

import BudgetSettingCard from './components/BudgetSettingCard'

export default function Budget() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
        subMain={
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>월별 수입/예산 관리</h1>

            <p className={styles.pageDescription}>이번 달 수입과 소비 예산을 설정하세요.</p>
          </div>
        }
      />

      <main className={styles.container}>
        <BudgetSettingCard onUnauthorized={() => navigate('/login', { replace: true })} />
      </main>
    </>
  )
}
