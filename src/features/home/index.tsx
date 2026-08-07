import HomeBanner from './components/HomeBanner'
import CategoryChart from './components/CategoryChart'
import SpendingSummary from './components/SpendingSummary'
import GoalProgress from './components/GoalProgress'
import EncouragementCard from './components/EncouragementCard'
import SpendingQuestion from './components/SpendingQuestion'
import HomeSkeleton from './components/HomeSkeleton'
import { useHomeData } from './hooks/useHomeData'
import styles from './Home.module.css'

export default function Home() {
  const { data, isLoading, isError, refetch } = useHomeData()

  if (isLoading) return <HomeSkeleton />

  if (isError) {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorText}>홈 정보를 불러오지 못했습니다.</p>
        <button className={styles.retryButton} onClick={() => refetch()}>
          다시 시도
        </button>
      </div>
    )
  }

  if (!data) return null

  const {
    monthlySpending,
    lastMonthSpending,
    budget,
    goalAmount,
    goalCurrent,
    categories,
    hasRecords,
  } = data

  const achievementPercent = goalAmount
    ? Math.min(100, Math.round((goalCurrent / goalAmount) * 100))
    : null

  const topCategory = categories[0]
  const topCategoryLabel = topCategory?.label ?? ''

  return (
    <main className={styles.main}>
      <HomeBanner goalSet={goalAmount !== null} achievementPercent={achievementPercent} />
      <div className={styles.content}>
        <CategoryChart
          categories={categories}
          hasRecords={hasRecords}
          topCategoryLabel={topCategoryLabel}
        />
        <SpendingSummary
          monthlySpending={monthlySpending}
          lastMonthSpending={lastMonthSpending}
          budget={budget}
        />
        <GoalProgress goalAmount={goalAmount} goalCurrent={goalCurrent} />
        <EncouragementCard />
        <SpendingQuestion />
      </div>
    </main>
  )
}
