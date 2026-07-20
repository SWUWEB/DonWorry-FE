import styles from './BudgetCard.module.css'

type BudgetCardProps = {
  remainingBudget: number
  achievementRate: number
}

export default function BudgetCard({
  remainingBudget,
  achievementRate,
}: BudgetCardProps) {

  return (
    <section className={styles.card}>
      <div>
        <p className={styles.label}>이번 달 남은 예산</p>
        <h2 className={styles.amount}>  
            ₩ {remainingBudget.toLocaleString('ko-KR')}
        </h2>
      </div>

      <div className={styles.badge}>
        달성률 {achievementRate}%
      </div>
    </section>
  )
}