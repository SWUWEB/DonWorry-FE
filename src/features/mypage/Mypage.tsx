import styles from './MyPage.module.css'
import ProfileCard from './components/ProfileCard'
import BudgetCard from './components/BudgetCard'
import MenuSection from './components/MenuSection'
import { useNavigate } from 'react-router-dom'
import HeaderBackButton from '@/shared/components/HeaderBackButton'

export default function MyPage() {
  const navigate = useNavigate()
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.backButton}>
          <HeaderBackButton onClick={() => navigate('/')} />
        </div>

        <h1 className={styles.title}>
          마이페이지
        </h1>
      </header>

      <ProfileCard
        name="000님"
        email="donworry@gmail.com"
      />

      <BudgetCard
        remainingBudget={155000}
        achievementRate={69}
      />
      <MenuSection />
    </main>

    
  )
}