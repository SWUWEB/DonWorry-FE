import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BackButton from '@/features/intervention/components/BackButton'
import AnswerButton from '@/features/intervention/components/AnswerButton'
import CountdownTimer from '@/features/intervention/components/CountdownTimer'
import { getRiskLevel, parseRiskScore } from '@/features/intervention/utils/riskLevel'
import type { RiskLevel } from '@/features/intervention/utils/riskLevel'
import styles from '../styles/RiskResultPage.module.css'

// 하드코딩됨. API 연결 시 수정 예정
const ITEM_NAME = '쿠어 워시드 디테처블 후드 점퍼(블랙)'
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
  const [searchParams] = useSearchParams()

  const score = parseRiskScore(searchParams.get('score'))

  useEffect(() => {
    if (score === null) {
      navigate('/record/intervention', { replace: true })
    }
  }, [score, navigate])

  const riskLevel = score !== null ? getRiskLevel(score) : 'low'
  const { heading, timerSeconds } = RISK_CONTENT[riskLevel]

  const [waitComplete, setWaitComplete] = useState(timerSeconds === null)

  if (score === null) return null

  return (
    <div className={styles.container}>
      <BackButton />

      <h1 className={styles.heading}>
        {heading.split('\n').map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </h1>

      <p className={styles.description}>
        {ITEM_NAME}을
        <br />
        사기 위해서는 <strong className={styles.highlight}>아르바이트 {WORK_HOURS}시간</strong> 동안
        근무해야 합니다
      </p>

      <div className={styles.timerWrapper}>
        {timerSeconds !== null && (
          <CountdownTimer durationSeconds={timerSeconds} onComplete={() => setWaitComplete(true)} />
        )}
      </div>

      <div className={styles.buttons}>
        <AnswerButton label="안 살게요" variant="outline" onClick={() => navigate('/record')} />
        <AnswerButton
          label="그래도 살게요"
          variant="filled"
          disabled={!waitComplete}
          onClick={() => navigate('/record')}
        />
      </div>
    </div>
  )
}
