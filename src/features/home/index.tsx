import HomeBanner from './components/HomeBanner'
import CategoryChart from './components/CategoryChart'
import SpendingSummary from './components/SpendingSummary'
import GoalProgress from './components/GoalProgress'
import EncouragementCard from './components/EncouragementCard'
import SpendingQuestion from './components/SpendingQuestion'
import styles from './Home.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBanner />
      <div className={styles.content}>
        <CategoryChart />
        <SpendingSummary />
        <GoalProgress />
        <EncouragementCard />
        <SpendingQuestion />
      </div>
    </main>
  )
}
