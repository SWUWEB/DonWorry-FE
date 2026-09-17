import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { isUnauthorizedError } from '@/shared/utils/isUnauthorizedError'
import { useDeleteSavingGoal, useMe, useSetSavingGoal } from '../hooks/useUser'
import { useConsumptionReport } from '../hooks/useConsumptionReport'
import styles from './GoalSettingCard.module.css'

interface GoalSettingCardProps {
  onUnauthorized?: () => void
}

export default function GoalSettingCard({ onUnauthorized = () => {} }: GoalSettingCardProps) {
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
  const { mutate: deleteSavingGoal, isPending: isDeleting } = useDeleteSavingGoal()

  const [goalText, setGoalText] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [deleted, setDeleted] = useState(false)
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  const isBusy = isPending || isDeleting

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
    if (isBusy) return
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
    setDeleted(false)

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

  const handleDelete = () => {
    if (isBusy) return
    setDeleteError('')
    deleteSavingGoal(undefined, {
      onSuccess: () => {
        setIsDeleteOpen(false)
        setGoalText('')
        setGoalAmount('')
        setIsActive(true)
        setError('')
        setSaved(false)
        setDeleted(true)
      },
      onError: (err) => {
        if (isUnauthorizedError(err)) {
          setIsDeleteOpen(false)
          setIsUnauthorized(true)
          return
        }
        setDeleteError('목표를 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.')
      },
    })
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>목표 설정</h2>

      <div className={styles.inputGroup}>
        <InputField
          label="목표 이름"
          placeholder="예: 여행 자금, 목돈 마련"
          value={goalText}
          readOnly={isBusy}
          onChange={(e) => {
            setGoalText(e.target.value)
            setSaved(false)
            setDeleted(false)
          }}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="목표 금액"
          placeholder="금액을 입력하세요"
          inputMode="numeric"
          value={goalAmount}
          readOnly={isBusy}
          onChange={(e) => {
            setGoalAmount(e.target.value.replace(/[^0-9]/g, ''))
            setSaved(false)
            setDeleted(false)
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
          disabled={isBusy}
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
      {deleted && (
        <p className={styles.formSuccess} role="status">
          목표가 삭제되었습니다. 새 목표를 설정해보세요.
        </p>
      )}

      <Button onClick={handleSave} disabled={isBusy}>
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
      {profile.savingGoalText && (
        <Button
          variant="outline"
          disabled={isBusy}
          onClick={() => {
            setDeleteError('')
            setIsDeleteOpen(true)
          }}
        >
          목표 삭제
        </Button>
      )}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="목표를 삭제할까요?"
        description="현재 목표가 해제됩니다. 삭제 후 새 목표를 설정할 수 있어요."
        confirmText={isDeleting ? '삭제 중...' : '삭제하기'}
        isLoading={isDeleting}
        errorMessage={deleteError}
        onCancel={() => {
          if (!isDeleting) setIsDeleteOpen(false)
        }}
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        isOpen={isUnauthorized}
        title="로그인이 필요합니다."
        description="로그인 후 다시 이용해주세요."
        confirmText="로그인하기"
        onlyConfirm
        onCancel={onUnauthorized}
        onConfirm={onUnauthorized}
      />
    </section>
  )
}
