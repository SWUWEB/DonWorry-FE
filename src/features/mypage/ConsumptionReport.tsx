import Header from '@/components/layout/Header'
import {
  IoChevronBack,
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import ConsumptionReportForm from './components/ConsumptionReportForm'
import styles from './ConsumptionReport.module.css'

export default function ConsumptionReport() {
  const navigate = useNavigate()

  const handleBack = () => {
  if (window.history.length > 1) {
    navigate(-1)
    return
  }
  navigate('/mypage', { replace: true })
}

  return (
    <>
      <Header
        left={<span className={styles.logo}>Logo</span>}


        subLeft={
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            <IoChevronBack size={20} />
          </button>
        }

        subMain={
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              소비 분석 리포트
            </h1>

            <p className={styles.pageDescription}>
              소비 패턴을 분석하고 절약 현황을 확인하세요.
            </p>
          </div>
        }
      />

      <main className={styles.container}>
        <ConsumptionReportForm />
      </main>
    </>
  )
}