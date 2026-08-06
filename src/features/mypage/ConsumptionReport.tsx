import Header from '@/components/layout/Header'
import {
  IoChevronBack,
  IoNotifications,
  IoMenu,
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import ConsumptionReportForm from './components/ConsumptionReportForm'
import styles from './ConsumptionReport.module.css'

export default function ConsumptionReport() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        left={<span className={styles.logo}>Logo</span>}

        right={
          <>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="알림"
            >
              <IoNotifications size={20} />
            </button>

            <button
              type="button"
              className={styles.iconButton}
              aria-label="메뉴"
            >
              <IoMenu size={20} />
            </button>
          </>
        }

        subLeft={
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
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