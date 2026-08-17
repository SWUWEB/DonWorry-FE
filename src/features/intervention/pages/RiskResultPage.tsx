import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BackButton from '@/features/intervention/components/BackButton'
import AnswerButton from '@/features/intervention/components/AnswerButton'
import CountdownTimer from '@/features/intervention/components/CountdownTimer'
import type { RiskAnalysis, RiskLevel } from '@/features/intervention/api/interventionApi'
import type { RecordDraft } from '@/features/record/pages/RecordCreatePage'
import type { RecordType } from '@/features/record/mockRecords'
import { useCreateConsumptionRecord } from '@/features/record/hooks/useConsumptionRecords'
import styles from '../styles/RiskResultPage.module.css'

// 하드코딩됨. 급여(시급) 정보를 다루는 기능이 아직 없어 실제 근무 시간 계산 API 연결 전까지 유지합니다.
const WORK_HOURS = 26

const RISK_CONTENT: Record<RiskLevel, { heading: string; timerSeconds: number | null }> = {
  high: { heading: '충동소비 가능성 높음', timerSeconds: 180 },
  medium: {
    heading: '충동 소비 가능성은 낮지만\n좀 더 생각해보세요.',
    timerSeconds: 60,
  },
  low: { heading: '충동소비 가능성 낮음', timerSeconds: null },
}

export default function RiskResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { draft?: RecordDraft; risk?: RiskAnalysis } | null
  const draft = state?.draft
  const risk = state?.risk

  const createRecord = useCreateConsumptionRecord()

  useEffect(() => {
    if (!draft || !risk) {
      navigate('/record/new', { replace: true })
    }
  }, [draft, risk, navigate])

  const { heading, timerSeconds } = RISK_CONTENT[risk?.riskLevel ?? 'low']
  const [waitComplete, setWaitComplete] = useState(timerSeconds === null)

  if (!draft || !risk) return null

  const handleDecision = (type: RecordType) => {
    createRecord.mutate(
      {
        type,
        productName: draft.title,
        price: draft.amount,
        category: draft.category,
        reason: draft.reason,
        riskScore: risk.riskScore,
        productUrl: draft.productUrl,
      },
      { onSuccess: () => navigate('/record', { replace: true }) },
    )
  }

  return (
    <div className={styles.container}>
      <BackButton />

      <h1 className={styles.heading}>
        {heading.split('\n').map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </h1>

      <p className={styles.description}>
        {draft.title}을
        <br />
        사기 위해서는 <strong className={styles.highlight}>아르바이트 {WORK_HOURS}시간</strong> 동안
        근무해야 합니다
      </p>

      <div className={styles.timerWrapper}>
        {timerSeconds !== null && (
          <CountdownTimer durationSeconds={timerSeconds} onComplete={() => setWaitComplete(true)} />
        )}
      </div>

      {createRecord.isError && (
        <p className={styles.errorText}>저장에 실패했습니다. 다시 시도해주세요.</p>
      )}

      <div className={styles.buttons}>
        <AnswerButton
          label="안 살게요"
          variant="outline"
          disabled={createRecord.isPending}
          onClick={() => handleDecision('saved')}
        />
        <AnswerButton
          label="그래도 살게요"
          variant="filled"
          disabled={!waitComplete || createRecord.isPending}
          onClick={() => handleDecision('consume')}
        />
      </div>
    </div>
  )
}
