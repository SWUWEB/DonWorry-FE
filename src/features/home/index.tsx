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
    goalStatus,
    achievementRate,
    achievementRemainingAmount,
    monthlySpending,
    comparisonRate,
    comparisonMessage,
    budgetStatus,
    remainingBudget,
    budgetMessage,
    categories,
    categorySummaryText,
    hasRecords,
  } = data

  return (
    <main className={styles.main}>
      <HomeBanner goalStatus={goalStatus} achievementRate={achievementRate} />
      <div className={styles.content}>
        <CategoryChart
          categories={categories}
          hasRecords={hasRecords}
          summaryText={categorySummaryText}
        />
        <SpendingSummary
          monthlySpending={monthlySpending}
          comparisonRate={comparisonRate}
          comparisonMessage={comparisonMessage}
          budgetStatus={budgetStatus}
          remainingBudget={remainingBudget}
          budgetMessage={budgetMessage}
        />
        <GoalProgress
          goalStatus={goalStatus}
          achievementRate={achievementRate}
          remainingAmount={achievementRemainingAmount}
        />
        <EncouragementCard />
        <SpendingQuestion />
      </div>
    </main>
  )
}
