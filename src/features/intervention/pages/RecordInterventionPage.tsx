import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import InterventionHeader from '@/features/intervention/components/InterventionHeader'
import AnswerButton from '@/features/intervention/components/AnswerButton'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import {
  useInterventionQuestions,
  useRiskScore,
} from '@/features/intervention/hooks/useIntervention'
import type { InterventionAnswer } from '@/features/intervention/api/interventionApi'
import type { RecordDraft } from '@/features/record/pages/RecordCreatePage'
import styles from '../styles/RecordInterventionPage.module.css'

export default function RecordInterventionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const draft = (location.state as { draft?: RecordDraft } | null)?.draft

  useEffect(() => {
    if (!draft) {
      navigate('/record/new', { replace: true })
    }
  }, [draft, navigate])

  const {
    data,
    isLoading: isLoadingQuestions,
    isError: isQuestionsError,
    refetch: refetchQuestions,
  } = useInterventionQuestions(draft?.category)
  const riskScoreMutation = useRiskScore()

  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<InterventionAnswer[]>([])

  if (!draft) return null

  if (isLoadingQuestions) {
    return <p className={styles.message}>불러오는 중...</p>
  }

  if (isQuestionsError || !data) {
    return (
      <div className={styles.message}>
        <p>질문을 불러오지 못했습니다.</p>
        <button type="button" className={styles.retryButton} onClick={() => refetchQuestions()}>
          다시 시도
        </button>
      </div>
    )
  }

  const { questions, recentCategoryConsumptionCount, recentCategoryConsumptions } = data

  const isValidQuestions =
    questions.length === 3 &&
    new Set(questions.map((item) => item.questionId)).size === 3 &&
    questions.every(
      (item) =>
        item.options.length === 2 &&
        new Set(item.options.map((option) => option.answerValue)).size === 2,
    )

  if (!isValidQuestions) {
    return <p className={styles.message}>질문 정보를 처리할 수 없습니다.</p>
  }

  const totalSteps = questions.length
  const question = questions[step - 1]

  if (!question) {
    return <p className={styles.message}>질문 정보를 처리할 수 없습니다.</p>
  }

  const isLastQuestion = step === totalSteps
  const [outlineOption, filledOption] = question.options

  const handleAnswer = (answerValue: boolean) => {
    const nextAnswers = [...answers, { questionId: question.questionId, answerValue }]

    if (!isLastQuestion) {
      setAnswers(nextAnswers)
      setStep(step + 1)
      return
    }

    riskScoreMutation.mutate(nextAnswers, {
      onSuccess: (risk) => {
        navigate('/record/intervention/result', {
          replace: true,
          state: { draft, risk, answers: nextAnswers },
        })
      },
    })
  }

  const handleBack = () => {
    if (step === 1) {
      navigate(-1)
      return
    }

    setAnswers((prev) => prev.slice(0, -1))
    setStep((prev) => prev - 1)
  }

  return (
    <div className={styles.container}>
      <InterventionHeader step={step} totalSteps={totalSteps} onBack={handleBack} />

      <div className={styles.content}>
        <h2 className={styles.heading}>
          Q{step}.
          <br />
          {question.heading}
        </h2>

        <div className={styles.description}>
          {question.description.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {isLastQuestion && (
          <RecentSpendingList
            count={recentCategoryConsumptionCount}
            records={recentCategoryConsumptions}
          />
        )}
      </div>

      {riskScoreMutation.isError && (
        <p className={styles.errorText}>위험도 계산에 실패했습니다. 다시 시도해주세요.</p>
      )}

      <div className={styles.buttons}>
        <AnswerButton
          variant="outline"
          label={outlineOption?.label ?? ''}
          disabled={riskScoreMutation.isPending}
          onClick={() => handleAnswer(outlineOption?.answerValue ?? false)}
        />
        <AnswerButton
          variant="filled"
          label={filledOption?.label ?? ''}
          disabled={riskScoreMutation.isPending}
          onClick={() => handleAnswer(filledOption?.answerValue ?? true)}
        />
      </div>
    </div>
  )
}
