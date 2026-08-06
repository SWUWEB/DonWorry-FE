import { useNavigate } from 'react-router-dom'
import styles from './MenuSection.module.css'
import MenuItem from './MenuItem'


export default function MenuSection() {
  const navigate = useNavigate()

  return (
    <>
      <h3 className={styles.heading}>
        재무 관리
      </h3>

      <section className={styles.card}>
        <MenuItem
          icon="solar:wallet-money-outline"
          title="월별 수입/예산 관리"
        />

        <MenuItem
          icon="mynaui:target"
          title="목표 금액 설정"
          onClick={() => navigate('/goal-amount')}
        />

        <MenuItem
          icon="mynaui:chart-column-solid"
          title="상세 소비 분석 리포트"
        />
      </section>

      <h3 className={styles.heading}>
        설정
      </h3>

      <section className={styles.card}>
        <MenuItem
          icon="lucide:bell"
          title="알림 설정"
          onClick={() => navigate('/notification')}
        />

        <MenuItem
          icon="uil:setting"
          title="앱 설정"
        />
      </section>
    </>
  )
}