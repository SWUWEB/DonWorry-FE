import { useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import { CategoryIcon } from '@/assets/icons/CategoryIcon.tsx'
import { CATEGORY_COLORS } from '@/assets/icons/CategoryIconMap.tsx'
import { CATEGORIES } from '@/constants/product'
import type { Category } from '@/features/temptation/types'
import { formatKRW } from '@/shared/utils/currency'
import styles from './CategoryBudgetSection.module.css'

export interface CategoryBudgetEntry {
  category: Category
  budgetAmount: number
  spentAmount: number
}

interface CategoryBudgetRowProps {
  entry: CategoryBudgetEntry
  onChangeBudget: (budgetAmount: number) => void
}

function CategoryBudgetRow({ entry, onChangeBudget }: CategoryBudgetRowProps) {
  const { category, budgetAmount, spentAmount } = entry
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(String(budgetAmount))

  const remaining = budgetAmount - spentAmount
  const percent = budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0

  const commitDraft = () => {
    const digits = draft.replace(/[^0-9]/g, '')
    onChangeBudget(digits === '' ? 0 : Number(digits))
    setIsEditing(false)
  }

  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <CategoryIcon category={category} size={40} />

        <div className={styles.rowInfo}>
          <p className={styles.categoryName}>{category}</p>
          <p className={styles.remaining}>{formatKRW(Math.max(remaining, 0))} 남음</p>
        </div>

        {isEditing ? (
          <input
            autoFocus
            className={styles.budgetInput}
            inputMode="numeric"
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
            onBlur={() => setTimeout(commitDraft, 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitDraft()
            }}
          />
        ) : (
          <button
            type="button"
            className={styles.budgetButton}
            onClick={() => {
              setDraft(String(budgetAmount))
              setIsEditing(true)
            }}
          >
            <span className={styles.budgetAmount}>{formatKRW(budgetAmount)}</span>
            <span className={styles.editHint}>탭하여 수정</span>
          </button>
        )}
      </div>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{
            width: `${Math.min(100, percent)}%`,
            backgroundColor: CATEGORY_COLORS[category],
          }}
        />
      </div>

      <div className={styles.progressRow}>
        <span>{formatKRW(spentAmount)} 사용</span>
        <span className={styles.percent} style={{ color: CATEGORY_COLORS[category] }}>
          {percent}%
        </span>
      </div>
    </div>
  )
}

interface CategoryBudgetSectionProps {
  entries: CategoryBudgetEntry[]
  onChangeBudget: (category: Category, budgetAmount: number) => void
  onAddCategory: (category: Category) => void
}

export default function CategoryBudgetSection({
  entries,
  onChangeBudget,
  onAddCategory,
}: CategoryBudgetSectionProps) {
  const [isPicking, setIsPicking] = useState(false)
  const usedCategories = new Set(entries.map((entry) => entry.category))
  const availableCategories = CATEGORIES.filter((category) => !usedCategories.has(category))
  const totalBudget = entries.reduce((sum, entry) => sum + entry.budgetAmount, 0)

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>카테고리별 예산</h2>
        <span className={styles.totalBadge}>총 {formatKRW(totalBudget)}</span>
      </div>

      {entries.map((entry) => (
        <CategoryBudgetRow
          key={entry.category}
          entry={entry}
          onChangeBudget={(budgetAmount) => onChangeBudget(entry.category, budgetAmount)}
        />
      ))}

      {isPicking ? (
        <select
          autoFocus
          className={styles.categoryPicker}
          value=""
          onChange={(e) => {
            const category = e.target.value as Category
            if (category) onAddCategory(category)
            setIsPicking(false)
          }}
          onBlur={() => setIsPicking(false)}
        >
          <option value="" disabled>
            카테고리 선택
          </option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      ) : (
        availableCategories.length > 0 && (
          <button type="button" className={styles.addButton} onClick={() => setIsPicking(true)}>
            <IoAdd size={18} />
            카테고리 추가
          </button>
        )
      )}
    </section>
  )
}
