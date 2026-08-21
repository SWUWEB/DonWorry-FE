import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { IoChevronBack, IoChevronForward, IoPencilOutline } from 'react-icons/io5'
import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import { formatKRW } from '@/shared/utils/currency'
import { getCurrentYearMonth, shiftYearMonth } from '@/shared/utils/date'
import type { Category } from '@/features/temptation/types'
import { useBudget, useMe, useSetBudget } from '../hooks/useUser'
import CategoryBudgetSection, { type CategoryBudgetEntry } from './CategoryBudgetSection'
import HourlyWageCard from './HourlyWageCard'
import styles from './BudgetSettingCard.module.css'

function toDigits(value: string) {
  return value.replace(/[^0-9]/g, '')
}

function formatManwon(amount: number): string {
  return `${Math.round(amount / 10000).toLocaleString('ko-KR')}만원`
}

interface EditableAmountRowProps {
  label: string
  helper: string
  value: string
  onChange: (value: string) => void
}

// "이번 달 수입" / "이번 달 예산" 카드 — 탭하면 인라인으로 편집됩니다.
function EditableAmountRow({ label, helper, value, onChange }: EditableAmountRowProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className={styles.editableCard}>
        <InputField
          label={label}
          placeholder="금액을 입력하세요"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(toDigits(e.target.value))}
          // blur가 즉시 행을 접으면 레이아웃이 먼저 흔들려서, 같은 클릭으로 이어지는
          // 다른 버튼(예: 저장하기)의 mouseup이 엉뚱한 위치에 떨어져 클릭이 씹힙니다.
          // 현재 클릭 이벤트가 끝난 뒤에 접히도록 한 틱 미룹니다.
          onBlur={() => setTimeout(() => setIsEditing(false), 0)}
          rightElement={<span className={styles.unit}>원</span>}
        />
      </div>
    )
  }

  return (
    <button type="button" className={styles.editableCard} onClick={() => setIsEditing(true)}>
      <div className={styles.editableText}>
        <p className={styles.editableLabel}>{label}</p>
        <p className={styles.editableHelper}>{helper}</p>
      </div>

      <span className={styles.editableValue}>
        {value ? formatKRW(Number(value)) : '설정하기'}
        <IoPencilOutline size={16} />
      </span>
    </button>
  )
}

export default function BudgetSettingCard() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth())
  const isCurrentMonth = yearMonth === getCurrentYearMonth()
  const [year, month] = yearMonth.split('-')

  const { data: budget, isLoading, isError, refetch } = useBudget(yearMonth)
  const { data: profile } = useMe()
  const { mutate: setBudget, isPending } = useSetBudget()

  const [income, setIncome] = useState('')
  const [categoryEntries, setCategoryEntries] = useState<CategoryBudgetEntry[]>([])
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [hourlyWageOverride, setHourlyWageOverride] = useState<string | null>(null)

  useEffect(() => {
    // 선택한 월의 서버 값을 편집 가능한 로컬 상태로 반영합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIncome(budget?.monthlyIncome === null || !budget ? '' : String(budget.monthlyIncome))
    setCategoryEntries(
      budget?.categoryBudgets.map(({ category, budgetAmount, spentAmount }) => ({
        category,
        budgetAmount,
        spentAmount,
      })) ?? [],
    )
  }, [budget, yearMonth])

  const totalBudget = categoryEntries.reduce((sum, entry) => sum + entry.budgetAmount, 0)
  const hourlyWage = hourlyWageOverride ?? profile?.hourlyWage ?? ''

  const handleChangeCategoryBudget = (category: Category, budgetAmount: number) => {
    setCategoryEntries((prev) =>
      prev.map((entry) => (entry.category === category ? { ...entry, budgetAmount } : entry)),
    )
    setError('')
    setSaved(false)
  }

  const handleAddCategory = (category: Category) => {
    setCategoryEntries((prev) => [...prev, { category, budgetAmount: 0, spentAmount: 0 }])
    setError('')
    setSaved(false)
  }

  const handleChangeMonth = (delta: number) => {
    setError('')
    setSaved(false)
    setYearMonth((prev) => shiftYearMonth(prev, delta))
  }

  const handleSave = () => {
    const hasIncome = income.trim() !== ''
    const hasCategoryBudgets = categoryEntries.length > 0

    if (!hasIncome && !hasCategoryBudgets) {
      setError('수입 또는 카테고리별 예산을 설정해주세요.')
      return
    }

    // API는 monthlyIncome에 null을 받지 않으므로, 기존 수입을 지운 경우 0을 명시해 초기화합니다.
    const incomeAmount = hasIncome ? Number(income) : budget?.monthlyIncome != null ? 0 : undefined

    if (incomeAmount !== undefined && !Number.isFinite(incomeAmount)) {
      setError('수입 금액을 다시 확인해주세요.')
      return
    }

    setError('')
    setSaved(false)

    setBudget(
      {
        yearMonth,
        ...(incomeAmount !== undefined && { monthlyIncome: incomeAmount }),
        ...(hasCategoryBudgets && {
          monthlyBudget: totalBudget,
          categoryBudgets: categoryEntries.map(({ category, budgetAmount }) => ({
            category,
            budgetAmount,
          })),
        }),
      },
      {
        onSuccess: () => setSaved(true),
        onError: (err) => {
          const fieldError = isAxiosError(err)
            ? Object.values(
                (err.response?.data as { errors?: { fieldErrors?: Record<string, string[]> } })
                  ?.errors?.fieldErrors ?? {},
              )
                .flat()
                .find(Boolean)
            : undefined

          setError(fieldError ?? '저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
        },
      },
    )
  }

  const incomeAmount = budget?.monthlyIncome ?? 0
  const consumedAmount = budget?.spentAmount ?? 0
  const remaining = budget?.remainingAmount ?? 0
  const usagePercent = Math.min(100, budget?.usageRate ?? 0)

  return (
    <>
      <div className={styles.monthNav}>
        <button type="button" aria-label="이전 달" onClick={() => handleChangeMonth(-1)}>
          <IoChevronBack size={20} />
        </button>

        <span className={styles.monthLabel}>
          {year}년 {Number(month)}월
        </span>

        <button type="button" aria-label="다음 달" onClick={() => handleChangeMonth(1)}>
          <IoChevronForward size={20} />
        </button>
      </div>

      {isLoading && <p className={styles.message}>불러오는 중...</p>}

      {isError && (
        <div className={styles.message}>
          <p>예산 정보를 불러오지 못했습니다.</p>
          <button type="button" className={styles.retryButton} onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {isCurrentMonth && incomeAmount > 0 && (
            <section className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <div className={styles.summaryCol}>
                  <span className={styles.summaryLabel}>수입</span>
                  <span className={styles.summaryValue}>{formatManwon(incomeAmount)}</span>
                </div>
                <div className={styles.summaryCol}>
                  <span className={styles.summaryLabel}>지출</span>
                  <span className={styles.summaryValue}>{formatManwon(consumedAmount)}</span>
                </div>
                <div className={styles.summaryCol}>
                  <span className={styles.summaryLabel}>잔액</span>
                  <span className={styles.summaryValue}>{formatManwon(remaining)}</span>
                </div>
              </div>

              <div className={styles.progressRow}>
                <span>{formatKRW(consumedAmount)} 사용</span>
                <span>{usagePercent}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${usagePercent}%` }} />
              </div>
              <p className={styles.summaryFooter}>총 수입 {formatKRW(incomeAmount)}</p>
            </section>
          )}

          <EditableAmountRow
            label="이번 달 수입"
            helper={`${Number(month)}월 실제 수령액`}
            value={income}
            onChange={(v) => {
              setIncome(v)
              setError('')
              setSaved(false)
            }}
          />

          <HourlyWageCard
            hourlyWage={hourlyWage}
            monthlyIncome={Number(income) || 0}
            spentAmount={consumedAmount}
            monthLabel={isCurrentMonth ? '이번 달' : `${Number(month)}월`}
            onChangeHourlyWage={setHourlyWageOverride}
          />

          <CategoryBudgetSection
            entries={categoryEntries}
            onChangeBudget={handleChangeCategoryBudget}
            onAddCategory={handleAddCategory}
          />

          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
          {saved && <p className={styles.formSuccess}>저장되었습니다.</p>}

          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? '저장 중...' : '저장하기'}
          </Button>
        </>
      )}
    </>
  )
}
