import { useNavigate } from 'react-router-dom'
import { HiChevronRight, HiPlus } from 'react-icons/hi2'
import reportCharacter from '@/assets/images/coin_character_2.png'
import { formatKRW } from '@/shared/utils/currency'
import type { CategoryData } from '../types'
import styles from './CategoryChart.module.css'

interface CategoryChartProps {
  categories: CategoryData[]
  hasRecords: boolean
  summaryText: string
}

const MAX_BAR_HEIGHT = 80

// 요약 문구를 문장마다 줄바꿈하고, 가장 많이 쓴 카테고리 이름을 굵게 표시합니다.
function formatSummary(text: string, label: string | undefined) {
  let highlighted = false
  return text.split(/(?<=\.)\s+/).map((sentence, i) => {
    const index = label && !highlighted ? sentence.indexOf(label) : -1
    if (index >= 0 && label) highlighted = true
    return (
      <span key={i} className={styles.sentence}>
        {index >= 0 && label ? (
          <>
            {sentence.slice(0, index)}
            <strong className={styles.messageBold}>{label}</strong>
            {sentence.slice(index + label.length)}
          </>
        ) : (
          sentence
        )}
      </span>
    )
  })
}

export default function CategoryChart({ categories, hasRecords, summaryText }: CategoryChartProps) {
  const navigate = useNavigate()
  const maxAmount = Math.max(...categories.map((c) => c.amount), 1)
  const topCategory = categories.find((c) => !c.isOther && c.amount === maxAmount)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>카테고리별 지출</h2>
        <button
          type="button"
          className={styles.detailButton}
          onClick={() => navigate('/consumption-report')}
        >
          상세 보기
          <HiChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.card}>
        {hasRecords ? (
          <>
            <div className={styles.chartArea}>
              {categories.map((cat) => (
                <div
                  key={cat.categoryCode}
                  className={styles.barWrapper}
                  onClick={() =>
                    cat.isOther
                      ? navigate('/record?filter=other')
                      : navigate(`/record?category=${encodeURIComponent(cat.categoryCode)}`)
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
                >
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(cat.amount / maxAmount) * MAX_BAR_HEIGHT}px`,
                      backgroundColor: cat.color,
                    }}
                    aria-label={`${cat.label} ${formatKRW(cat.amount)}`}
                  />
                  <span className={styles.barLabel}>{cat.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.footer}>
              <HiPlus className={styles.plusIcon} size={16} aria-hidden="true" />
              <p className={styles.message}>{formatSummary(summaryText, topCategory?.label)}</p>
              <img src={reportCharacter} alt="" className={styles.character} />
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>이번 달 소비 기록이 아직 없어요.</p>
            <button className={styles.recordButton} onClick={() => navigate('/record')}>
              소비 기록하기
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
