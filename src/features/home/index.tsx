import HomeBanner from './components/HomeBanner'
import CategoryChart from './components/CategoryChart'
import SpendingSummary from './components/SpendingSummary'
import GoalProgress from './components/GoalProgress'
import EncouragementCard from './components/EncouragementCard'
import SpendingQuestion from './components/SpendingQuestion'

export default function Home() {
  return (
    <main>
      <HomeBanner />
      <CategoryChart />
      <SpendingSummary />
      <GoalProgress />
      <EncouragementCard />
      <SpendingQuestion />
    </main>
  )
}
