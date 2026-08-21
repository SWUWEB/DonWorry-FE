import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { useNavigate } from 'react-router-dom'

import ChangePasswordForm from './components/ChangePasswordForm'
import styles from './AccountPage.module.css'

export default function ChangePassword() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
        subMain={
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>비밀번호 변경</h1>

            <p className={styles.pageDescription}>프로필 및 계정 정보를 관리하세요.</p>
          </div>
        }
      />

      <main className={styles.container}>
        <ChangePasswordForm />
      </main>
    </>
  )
}
