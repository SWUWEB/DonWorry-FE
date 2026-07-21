import HomeBanner from './components/HomeBanner'
import CategoryChart from './components/CategoryChart'
import SpendingSummary from './components/SpendingSummary'
import GoalProgress from './components/GoalProgress'
import EncouragementCard from './components/EncouragementCard'
import SpendingQuestion from './components/SpendingQuestion'
import styles from './Home.module.css'

const mockHomeData = {
  achievementPercent: 70,
  monthlySpending: 350000,
  comparisonPercent: 12,
  goalCurrent: 350000,
  goalTotal: 500000,
}

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBanner achievementPercent={mockHomeData.achievementPercent} />
      <div className={styles.content}>
        <CategoryChart />
        <SpendingSummary
          monthlySpending={mockHomeData.monthlySpending}
          comparisonPercent={mockHomeData.comparisonPercent}
        />
        <GoalProgress current={mockHomeData.goalCurrent} goal={mockHomeData.goalTotal} />
        <EncouragementCard />
        <SpendingQuestion />
      </div>
    </main>
  )
}
