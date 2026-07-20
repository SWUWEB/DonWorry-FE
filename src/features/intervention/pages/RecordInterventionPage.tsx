import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InterventionHeader from '@/features/intervention/components/InterventionHeader'
import AnswerButton from '@/features/intervention/components/AnswerButton'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import type { RecentSpendingItem } from '@/features/intervention/components/RecentSpendingList'
import styles from '../styles/RecordInterventionPage.module.css'

interface AnswerOption {
  emoji: string
  label: string
  score: number
}

interface InterventionQuestion {
  heading: string
  description: string[]
  outline: AnswerOption
  filled: AnswerOption
  showRecentRecords?: boolean
}

// 하드코딩됨. API 연결 시 수정 예정
const RECENT_RECORDS: RecentSpendingItem[] = [
  { id: '1', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
  { id: '2', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
  { id: '3', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
]

// 답변별 점수는 기획에서 정의한 충동소비 가능성 채점 기준을 따릅니다.
const QUESTIONS: InterventionQuestion[] = [
  {
    heading: '혹시 이거, 이미 가지고 있진 않나요? 👀',
    description: ['집 어딘가에 비슷한 물건이 있을 수도 있어요', '한 번만 떠올려볼까요?'],
    outline: { emoji: '🤔', label: '없는 것 같아요', score: 0 },
    filled: { emoji: '👀', label: '있는 것 같아요', score: 2 },
  },
  {
    heading: '이거, 지금 꼭 필요한 걸까요?',
    description: ['조금만 미뤄도 괜찮을지 한 번 생각해봐도 좋아요'],
    outline: { emoji: '🔥', label: '지금 당장 필요해요', score: 0 },
    filled: { emoji: '😅', label: '나중에도 괜찮아요', score: 1 },
  },
  {
    heading: '비슷한 거, 최근에 산 적 있지 않나요?',
    description: ['비슷한 소비가 계속 이어지고 있을 수도 있어요', '한 번 돌아볼까요?'],
    outline: { emoji: '😐', label: '최근에 산 적 있어요', score: 2 },
    filled: { emoji: '😎', label: '최근에 산 적 없어요', score: 0 },
    showRecentRecords: true,
  },
]

const TOTAL_STEPS = QUESTIONS.length

export default function RecordInterventionPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<number[]>([])
  const question = QUESTIONS[step - 1]

  const handleAnswer = (optionScore: number) => {
    const nextAnswers = [...answers, optionScore]

    if (step < TOTAL_STEPS) {
      setAnswers(nextAnswers)
      setStep(step + 1)
      return
    }

    const totalScore = nextAnswers.reduce((sum, value) => sum + value, 0)
    navigate(`/record/intervention/result?score=${totalScore}`, { replace: true })
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
      <InterventionHeader step={step} totalSteps={TOTAL_STEPS} onBack={handleBack} />

      <div className={styles.content}>
        <h2 className={styles.heading}>
          Q{step}.
          <br />
          {question.heading}
        </h2>

        <div className={styles.description}>
          {question.description.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {question.showRecentRecords && (
          <RecentSpendingList count={RECENT_RECORDS.length} records={RECENT_RECORDS} />
        )}
      </div>

      <div className={styles.buttons}>
        <AnswerButton
          variant="outline"
          emoji={question.outline.emoji}
          label={question.outline.label}
          onClick={() => handleAnswer(question.outline.score)}
        />
        <AnswerButton
          variant="filled"
          emoji={question.filled.emoji}
          label={question.filled.label}
          onClick={() => handleAnswer(question.filled.score)}
        />
      </div>
    </div>
  )
}
