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

      <ProfileCard />
      <BudgetCard />
      <MenuSection />
    </main>

    
  )
}