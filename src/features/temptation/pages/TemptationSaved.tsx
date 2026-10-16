import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { ProductSummaryCard } from '../components/temptationJudge/ProductSummaryCard'
import type { Category } from '../types'
import styles from './TemptationSaved.module.css'

interface SavedLocationState {
  name: string
  category: Category
  price: number
}

export default function TemptationSaved() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as SavedLocationState | null

  const handleBack = () => {
    navigate('/temptation')
  }

  const handleGoList = () => {
    navigate('/temptation')
  }

  if (!state) {
    return <p>표시할 정보가 없습니다.</p>
  }

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton onClick={handleBack} />}
        subMain={
          <div className={styles.headerText}>
            <h2 className={styles.headerTitle}>잘 참았어요!</h2>
            <p className={styles.headerDescription}>
              충동 소비를 이겨냈어요. 참은 기록에 추가될 거예요.
            </p>
          </div>
        }
      />
      <div className={styles.wrapper}>
        <div className={styles.celebrateIconWrapper}>
          <span className={styles.celebrateIcon} aria-hidden="true">
            🎉
          </span>
        </div>

        <ProductSummaryCard
          category={state.category}
          name={state.name}
          price={state.price}
          savedMode
        />

        <div className={styles.praiseBox}>
          <p className={styles.praiseTitle}>오늘 정말 잘 했어요 👏</p>
          <p className={styles.praiseDescription}>
            충동 소비를 한 번 이겨낼 때마다 더 나은 소비 습관이 만들어져요. 오늘의 선택이 쌓여
            미래의 나를 바꿔줄 거예요.
          </p>
        </div>

        <button type="button" className={styles.listBtn} onClick={handleGoList}>
          목록으로 돌아가기
        </button>
      </div>
    </>
  )
}
