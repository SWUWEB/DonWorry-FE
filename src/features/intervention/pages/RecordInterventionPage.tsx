import { useState } from 'react'
import InterventionHeader from '@/features/intervention/components/InterventionHeader'
import AnswerButton from '@/features/intervention/components/AnswerButton'
import RecentSpendingList from '@/features/intervention/components/RecentSpendingList'
import type { RecentSpendingItem } from '@/features/intervention/components/RecentSpendingList'
import styles from '../styles/RecordInterventionPage.module.css'

interface InterventionQuestion {
  heading: string
  description: string[]
  outline: { emoji: string; label: string }
  filled: { emoji: string; label: string }
  showRecentRecords?: boolean
}

// 하드코딩됨. API 연결 시 수정 예정
const RECENT_RECORDS: RecentSpendingItem[] = [
  { id: '1', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
  { id: '2', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
  { id: '3', title: '투썸플레이스 신봉점', date: '4월 16일', amount: 6100 },
]

// 하드코딩됨. API 연결 시 수정 예정
const QUESTIONS: InterventionQuestion[] = [
  {
    heading: '혹시 이거, 이미 가지고 있진 않나요? 👀',
    description: ['집 어딘가에 비슷한 물건이 있을 수도 있어요', '한 번만 떠올려볼까요?'],
    outline: { emoji: '🤔', label: '없는 것 같아요' },
    filled: { emoji: '👀', label: '있는 것 같아요' },
  },
  {
    heading: '이거, 지금 꼭 필요한 걸까요?',
    description: ['조금만 미뤄도 괜찮을지 한 번 생각해봐도 좋아요'],
    outline: { emoji: '🔥', label: '지금 당장 필요해요' },
    filled: { emoji: '😅', label: '나중에도 괜찮아요' },
  },
  {
    heading: '비슷한 거, 최근에 산 적 있지 않나요?',
    description: ['비슷한 소비가 계속 이어지고 있을 수도 있어요', '한 번 돌아볼까요?'],
    outline: { emoji: '😐', label: '최근에 산 적 있어요' },
    filled: { emoji: '😎', label: '최근에 산 적 없어요' },
    showRecentRecords: true,
  },
]

const TOTAL_STEPS = QUESTIONS.length

export default function RecordInterventionPage() {
  // Step 상태 관리와 답변에 따른 다음 질문 이동/최종 처리는 #15에서 정식 구현 예정.
  // 지금은 화면 확인용으로 클릭 시 다음 질문으로만 넘어갑니다.
  const [step, setStep] = useState(1)
  const question = QUESTIONS[step - 1]

  const goToNextStep = () => {
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  return (
    <div className={styles.container}>
      <InterventionHeader step={step} totalSteps={TOTAL_STEPS} />

      <div className={styles.content}>
        <h2 className={styles.heading}>
          Q{step}.
          <br />
          {question.heading}
        </h2>

        <div className={styles.description}>
          {question.description.map((line) => (
            <p key={line}>{line}</p>
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
          onClick={goToNextStep}
        />
        <AnswerButton
          variant="filled"
          emoji={question.filled.emoji}
          label={question.filled.label}
          onClick={goToNextStep}
        />
      </div>
    </div>
  )
}
