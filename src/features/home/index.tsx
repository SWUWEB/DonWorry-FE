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
  encouragementMessage: '아직 시작 단계예요! 지금부터 조금씩 줄여볼까요?',
  spendingQuestion: '오늘 계획하지 않은 소비가 있었나요?',
  categories: [
    { label: '식비', amount: 150000, color: '#286A6D' },
    { label: '교통', amount: 80000, color: '#C7E3E3' },
    { label: '쇼핑', amount: 120000, color: '#E5F2F1' },
    { label: '저축', amount: 60000, color: '#C7E3E3' },
    { label: '기타', amount: 85000, color: '#2F7F82' },
  ],
  goalCurrent: 350000,
  goalTotal: 500000,
}

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBanner achievementPercent={mockHomeData.achievementPercent} />
      <div className={styles.content}>
        <CategoryChart categories={mockHomeData.categories} />
        <SpendingSummary
          monthlySpending={mockHomeData.monthlySpending}
          comparisonPercent={mockHomeData.comparisonPercent}
        />
        <GoalProgress current={mockHomeData.goalCurrent} goal={mockHomeData.goalTotal} />
        <EncouragementCard message={mockHomeData.encouragementMessage} />
        <SpendingQuestion question={mockHomeData.spendingQuestion} />
      </div>
    </main>
  )
}
