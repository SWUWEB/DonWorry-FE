import { useState } from 'react'
import { IoPencilOutline } from 'react-icons/io5'
import InputField from '@/shared/components/InputField'
import { formatKRW } from '@/shared/utils/currency'
import { calculateWorkHours } from '@/shared/utils/workHours'
import styles from './HourlyWageCard.module.css'

interface HourlyWageCardProps {
  hourlyWage: string
  monthlyIncome: number | null
  spentAmount: number
  monthLabel: string
  onChangeHourlyWage: (value: string) => void
}

function toDigits(value: string) {
  return value.replace(/[^0-9]/g, '').slice(0, 10)
}

function HoursValue({ value, accent = false }: { value: number | null; accent?: boolean }) {
  if (value === null) {
    return <span className={styles.emptyValue}>—</span>
  }

  return (
    <span
      className={`${styles.hoursValue} ${accent ? styles.hoursValueAccent : ''}`}
      aria-label={`${value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}시간`}
    >
      {value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}
      <span className={styles.hoursUnit}>시간</span>
    </span>
  )
}

export default function HourlyWageCard({
  hourlyWage,
  monthlyIncome,
  spentAmount,
  monthLabel,
  onChangeHourlyWage,
}: HourlyWageCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const wageAmount = Number(hourlyWage)
  const workedHours = calculateWorkHours(monthlyIncome, wageAmount)
  const spentHours = calculateWorkHours(spentAmount, wageAmount)

  return (
    <section className={styles.card}>
      {isEditing ? (
        <InputField
          autoFocus
          label="시급"
          placeholder="금액을 입력하세요"
          inputMode="numeric"
          maxLength={10}
          value={hourlyWage}
          onChange={(event) => onChangeHourlyWage(toDigits(event.target.value))}
          onBlur={() => setTimeout(() => setIsEditing(false), 0)}
          rightElement={<span className={styles.unit}>원</span>}
        />
      ) : (
        <button type="button" className={styles.wageRow} onClick={() => setIsEditing(true)}>
          <span className={styles.wageText}>
            <span className={styles.title}>시급</span>
            <span className={styles.description}>시간당 수령액</span>
          </span>

          <span className={styles.wageValue}>
            {hourlyWage ? formatKRW(wageAmount) : '설정하기'}
            <IoPencilOutline size={16} aria-hidden="true" />
          </span>
        </button>
      )}

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>{monthLabel} 근로 시간</span>
          <HoursValue value={workedHours} accent />
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>지출에 쓴 시간</span>
          <HoursValue value={spentHours} />
        </div>
      </div>
    </section>
  )
}
