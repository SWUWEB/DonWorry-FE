import styles from './MyPage.module.css'
import ProfileCard from './components/ProfileCard'
import BudgetCard from './components/BudgetCard'
import MenuSection from './components/MenuSection'
import { useNavigate } from 'react-router-dom'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { useMe } from './hooks/useUser'

export default function MyPage() {
  const navigate = useNavigate()
  const { data: profile } = useMe()

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.backButton}>
          <HeaderBackButton onClick={() => navigate('/')} />
        </div>

        <h1 className={styles.title}>마이페이지</h1>
      </header>

      <ProfileCard
        name={profile ? `${profile.nickname}님` : '...'}
        subtitle={profile?.phoneNumber ?? undefined}
      />

      <BudgetCard remainingBudget={155000} achievementRate={69} />
      <MenuSection />
    </main>
  )
}
