import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import { useMe, useSetSavingGoal } from '../hooks/useUser'
import { useConsumptionReport } from '../hooks/useConsumptionReport'
import styles from './GoalSettingCard.module.css'

export default function GoalSettingCard() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useMe()
  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
    refetch: refetchReport,
  } = useConsumptionReport()
  const { mutate: setSavingGoal, isPending } = useSetSavingGoal()

  const [goalText, setGoalText] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // 서버에 저장된 목표 이름과 현재 월의 목표 금액을 편집 상태로 반영합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoalText(profile?.savingGoalText ?? '')
    const targetAmount = report?.goalAchievement.targetAmount
    setGoalAmount(targetAmount == null ? '' : String(targetAmount))
    // GET /users/me에는 활성 여부가 없으므로, 저장된 목표가 있으면서 리포트가 NOT_SET이면
    // 비활성 목표로 간주합니다. 새 목표는 기존 UX대로 활성 상태에서 시작합니다.
    setIsActive(!profile?.savingGoalText || report?.goalAchievement.status !== 'NOT_SET')
  }, [profile, report])

  if (isProfileLoading || isReportLoading) {
    return (
      <section className={styles.card}>
        <h2 className={styles.title}>목표 설정</h2>
        <p className={styles.status}>목표 정보를 불러오는 중...</p>
      </section>
    )
  }

  if (isProfileError || isReportError || !profile || !report) {
    return (
      <section className={styles.card}>
        <h2 className={styles.title}>목표 설정</h2>
        <p className={styles.formError} role="alert">
          목표 정보를 불러오지 못했습니다.
        </p>
        <Button
          variant="outline"
          onClick={() => void Promise.all([refetchProfile(), refetchReport()])}
        >
          다시 시도
        </Button>
      </section>
    )
  }

  const handleSave = () => {
    if (!goalText.trim()) {
      setError('목표 이름을 입력해주세요.')
      return
    }

    const amount = Number(goalAmount.replace(/,/g, ''))
    if (!goalAmount.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError('목표 금액을 입력해주세요.')
      return
    }

    setError('')
    setSaved(false)

    setSavingGoal(
      { savingGoalText: goalText, targetSavingAmount: amount, savingGoalIsActive: isActive },
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

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>목표 설정</h2>

      <div className={styles.inputGroup}>
        <InputField
          label="목표 이름"
          placeholder="예: 여행 자금, 목돈 마련"
          value={goalText}
          onChange={(e) => {
            setGoalText(e.target.value)
            setSaved(false)
          }}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="목표 금액"
          placeholder="금액을 입력하세요"
          inputMode="numeric"
          value={goalAmount}
          onChange={(e) => {
            setGoalAmount(e.target.value.replace(/[^0-9]/g, ''))
            setSaved(false)
          }}
          rightElement={<span className={styles.unit}>원</span>}
        />
      </div>

      <div className={styles.toggleSection}>
        <div>
          <p className={styles.toggleTitle}>목표 달성 표시</p>

          <p className={styles.toggleDescription}>마이페이지에서 목표 달성률을 표시합니다</p>
        </div>

        <button
          type="button"
          className={`${styles.toggle} ${isActive ? styles.toggleOn : styles.toggleOff}`}
          aria-label={`목표 달성 표시 ${isActive ? '끄기' : '켜기'}`}
          onClick={() => {
            setIsActive((prev) => !prev)
            setSaved(false)
          }}
        >
          <div className={styles.toggleCircle} />
        </button>
      </div>

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}
      {saved && <p className={styles.formSuccess}>저장되었습니다.</p>}

      <Button onClick={handleSave} disabled={isPending}>
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </section>
  )
}
