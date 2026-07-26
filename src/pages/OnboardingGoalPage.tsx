import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './OnboardingGoalPage.module.css'

const PURPOSES = [
  { id: 'invest', emoji: '📊', label: '투자' },
  { id: 'travel', emoji: '✈️', label: '여행' },
  { id: 'hobby', emoji: '🎯', label: '취미' },
  { id: 'car', emoji: '🚗', label: '자동차' },
  { id: 'lumpsum', emoji: '💰', label: '목돈 마련' },
  { id: 'house', emoji: '🏠', label: '내 집 마련' },
  { id: 'retire', emoji: '👴', label: '노후 준비' },
  { id: 'selfdev', emoji: '📖', label: '자기계발' },
  { id: 'etc', emoji: '➕', label: '기타' },
]

const MIN_AMOUNT = 1_000
const MAX_AMOUNT = 1_000_000_000

function getAmountError(raw: string, value: number): string {
  if (raw === '') return '월 목표 금액을 입력해주세요.'
  if (value < MIN_AMOUNT) return '월 목표 금액은 1,000원 이상 입력해주세요.'
  if (value > MAX_AMOUNT) return '월 목표 금액은 10억 원 이하로 입력해주세요.'
  return ''
}

export default function OnboardingGoalPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [amountInput, setAmountInput] = useState('')
  const [amountTouched, setAmountTouched] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

  const rawAmount = amountInput.replace(/,/g, '')
  const amount = rawAmount === '' ? 0 : Number(rawAmount)
  const amountError = amountTouched ? getAmountError(rawAmount, amount) : ''
  const isAmountValid = rawAmount !== '' && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT
  const isActive = selectedId !== null && isAmountValid

  const selectedPurpose = PURPOSES.find(p => p.id === selectedId)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setSaveError('')
    if (raw === '') { setAmountInput(''); return }
    if (Number(raw) > MAX_AMOUNT) return
    setAmountInput(Number(raw).toLocaleString('ko-KR'))
  }

  const handleNext = async () => {
    setAmountTouched(true)
    if (!isActive || saving) return
    setSaving(true)
    setSaveError('')
    try {
      // TODO: API 호출 - 1·2단계 설정값 저장
      await Promise.resolve()
      navigate('/onboarding/step3')
    } catch {
      setSaveError('설정을 저장하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 진행 점 */}
        <div className={styles.dots}>
          <div className={styles.dot} />
          <div className={styles.dotActive} />
          <div className={styles.dot} />
        </div>

        {/* 타이틀 */}
        <h1 className={styles.title}>
          저축 / 절약 목적을<br />알려주세요
        </h1>
        <p className={styles.subtitle}>목표 금액과 저축 / 절약 목적을 함께 설정해보세요.</p>

        {/* 선택 안내 */}
        <div className={styles.labelRow}>
          <div className={styles.labelInner}>
            <span className={styles.label}>
              {selectedId ? '선택 완료' : '1개 이상 선택해주세요'}
            </span>
            {selectedId && (
              <button className={styles.resetBtn} onClick={() => setSelectedId(null)}>초기화</button>
            )}
          </div>
          <div className={styles.divider} />
        </div>

        {/* 목적 칩 */}
        <div className={styles.chips}>
          {PURPOSES.map(({ id, emoji, label }) => (
            <button
              key={id}
              className={`${styles.chip} ${selectedId === id ? styles.chipSelected : ''}`}
              onClick={() => setSelectedId(prev => prev === id ? null : id)}
            >
              <span className={styles.chipEmoji}>{emoji}</span>
              <span className={styles.chipLabel}>{label}</span>
            </button>
          ))}
        </div>

        {/* 월 목표 금액 */}
        <div className={styles.amountSection}>
          <p className={styles.amountLabel}>월 목표 금액</p>
          <div className={`${styles.inputWrap} ${amountError ? styles.inputWrapError : ''}`}>
            <input
              className={styles.amountInput}
              type="text"
              inputMode="numeric"
              value={amountInput}
              onChange={handleAmountChange}
              onBlur={() => setAmountTouched(true)}
              placeholder="0"
            />
            <span className={`${styles.wonLabel} ${amountInput ? styles.wonLabelActive : ''}`}>원</span>
          </div>
          {amountError ? (
            <p className={styles.errorMsg}>{amountError}</p>
          ) : isAmountValid ? (
            <p className={styles.amountHint}>월 {amount.toLocaleString('ko-KR')}원 목표</p>
          ) : null}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={styles.bottom}>
        {saveError && <p className={styles.saveError}>{saveError}</p>}
        {selectedPurpose && !saveError && (
          <div className={styles.selectedTags}>
            <span className={styles.tag}>{selectedPurpose.emoji} {selectedPurpose.label}</span>
          </div>
        )}
        <div className={styles.btnRow}>
          <button className={styles.prevBtn} onClick={() => navigate(-1)}>이전</button>
          <button
            className={`${styles.nextBtn} ${isActive && !saving ? styles.nextBtnActive : ''}`}
            onClick={handleNext}
          >
            {saving ? '저장 중...' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}
