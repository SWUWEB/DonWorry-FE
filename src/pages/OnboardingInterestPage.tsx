import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './OnboardingInterestPage.module.css'

const CATEGORIES = [
  { id: 'food', emoji: '🍔', label: '음식' },
  { id: 'transport', emoji: '🚌', label: '교통' },
  { id: 'shopping', emoji: '🛍️', label: '쇼핑' },
  { id: 'savings', emoji: '💰', label: '저축' },
  { id: 'beauty', emoji: '💄', label: '뷰티' },
  { id: 'education', emoji: '📚', label: '교육' },
  { id: 'sports', emoji: '⚽', label: '스포츠' },
  { id: 'family', emoji: '👨‍👩‍👧', label: '가족' },
  { id: 'dance', emoji: '🕺', label: '댄스' },
  { id: 'culture', emoji: '🎬', label: '문화생활' },
  { id: 'pets', emoji: '🐾', label: '반려동물' },
  { id: 'etc', emoji: '➕', label: '기타' },
]

const MAX_SELECT = 3

export default function OnboardingInterestPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showMaxMsg, setShowMaxMsg] = useState(false)

  useEffect(() => {
    if (!showMaxMsg) return
    const timer = setTimeout(() => setShowMaxMsg(false), 2000)
    return () => clearTimeout(timer)
  }, [showMaxMsg])

  const toggle = (id: string) => {
    if (selected.has(id)) {
      setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
    } else if (selected.size < MAX_SELECT) {
      setSelected(prev => new Set([...prev, id]))
    } else {
      setShowMaxMsg(true)
    }
  }

  const reset = () => setSelected(new Set())

  const selectedList = CATEGORIES.filter(c => selected.has(c.id))
  const hasSelected = selected.size > 0
  const isFull = selected.size === MAX_SELECT

  const handleNext = () => {
    if (!hasSelected) return
    navigate('/onboarding/step2', {
      state: { interests: selectedList.map(c => ({ emoji: c.emoji, label: c.label })) },
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 진행 점 */}
        <div className={styles.dots}>
          <div className={styles.dotActive} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>

        {/* 타이틀 */}
        <h1 className={styles.title}>
          관심 있는<br />소비 영역을 골라주세요
        </h1>
        <p className={styles.subtitle}>선택한 항목을 기반으로 맞춤 분석을 제공해드려요.</p>

        {/* 선택 안내 */}
        <div className={styles.labelRow}>
          <div className={styles.labelInner}>
            <span className={styles.label}>
              {hasSelected ? `최대 ${MAX_SELECT}개 선택됨` : '1개 이상 선택해주세요'}
            </span>
            {hasSelected && (
              <button className={styles.resetBtn} onClick={reset}>초기화</button>
            )}
          </div>
          <div className={styles.divider} />
        </div>

        {/* 카테고리 칩 */}
        <div className={styles.chips}>
          {CATEGORIES.map(({ id, emoji, label }) => {
            const isSelected = selected.has(id)
            const isDimmed = isFull && !isSelected
            return (
              <button
                key={id}
                className={`${styles.chip} ${isSelected ? styles.chipSelected : ''} ${isDimmed ? styles.chipDimmed : ''}`}
                onClick={() => toggle(id)}
              >
                <span className={styles.chipEmoji}>{emoji}</span>
                <span className={styles.chipLabel}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 최대 선택 토스트 */}
      {showMaxMsg && (
        <div className={styles.toast}>관심 영역은 최대 3개까지 선택할 수 있습니다.</div>
      )}

      {/* 하단 버튼 영역 */}
      <div className={styles.bottom}>
        {hasSelected && (
          <div className={styles.selectedTags}>
            {selectedList.map(({ id, emoji, label }) => (
              <span key={id} className={styles.tag}>
                {emoji} {label}
              </span>
            ))}
          </div>
        )}
        <button
          className={`${styles.nextBtn} ${hasSelected ? styles.nextBtnActive : ''}`}
          onClick={handleNext}
          disabled={!hasSelected}
        >
          {hasSelected ? `${selected.size} / ${MAX_SELECT}개 선택 · 다음` : '다음'}
        </button>
      </div>
    </div>
  )
}
