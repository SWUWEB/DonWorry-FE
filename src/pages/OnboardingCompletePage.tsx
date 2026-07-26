import { useNavigate, useLocation } from 'react-router-dom'
import styles from './OnboardingCompletePage.module.css'

interface OnboardingState {
  interests: { emoji: string; label: string }[]
  purpose: string
  purposeEmoji: string
  amount: number
}

export default function OnboardingCompletePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    interests = [],
    purpose = '',
    purposeEmoji = '➕',
    amount = 0,
  } = (location.state ?? {}) as Partial<OnboardingState>

  const interestsText = interests.map(i => i.label).join(' · ') || '-'

  const handleHome = () => {
    localStorage.setItem('onboardingComplete', 'true')
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 진행 점 */}
        <div className={styles.dots}>
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dotActive} />
        </div>

        <div className={styles.centerSection}>
          <div className={styles.emojiWrap}>👋</div>

          <div className={styles.badge}>설정 완료</div>

          <h1 className={styles.title}>준비 완료됐어요!</h1>

          <p className={styles.subtitle}>
            즐거운 소비관리를<br />지금 시작해보세요.
          </p>

          {/* 설정 요약 카드 */}
          <div className={styles.cards}>
            <div className={styles.card}>
              <span className={styles.cardEmoji}>🎯</span>
              <span className={styles.cardLabel}>월 목표</span>
              <span className={styles.cardValue}>{amount.toLocaleString('ko-KR')}원</span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardEmoji}>📊</span>
              <span className={styles.cardLabel}>관심사</span>
              <span className={styles.cardValue}>{interestsText}</span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardEmoji}>{purposeEmoji}</span>
              <span className={styles.cardLabel}>저축 목적</span>
              <span className={styles.cardValue}>{purpose || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 홈으로 가기 버튼 */}
      <div className={styles.bottom}>
        <button className={styles.homeBtn} onClick={handleHome}>홈으로 가기</button>
      </div>
    </div>
  )
}
