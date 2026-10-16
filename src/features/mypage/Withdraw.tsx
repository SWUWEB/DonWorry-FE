import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { useNavigate } from 'react-router-dom'

import WithdrawForm from './components/WithdrawForm'
import styles from './AccountPage.module.css'

export default function Withdraw() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
        subMain={
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>회원 탈퇴</h1>

            <p className={styles.pageDescription}>탈퇴 전 아래 내용을 꼭 확인해주세요.</p>
          </div>
        }
      />

      <main className={styles.container}>
        <WithdrawForm />
      </main>
    </>
  )
}
