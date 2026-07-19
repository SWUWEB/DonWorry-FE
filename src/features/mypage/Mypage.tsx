import styles from './MyPage.module.css'
import ProfileCard from './components/ProfileCard'
import BudgetCard from './components/BudgetCard'
import MenuSection from './components/MenuSection'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'



export default function MyPage() {
    const navigate = useNavigate()
  return (
    <main className={styles.container}>
        
      <header className={styles.header}>
        <button
          type="button"
          aria-label="뒤로가기"
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          <Icon
          icon="icon-park-outline:left"
          className={styles.backIcon}
        />
        </button>

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