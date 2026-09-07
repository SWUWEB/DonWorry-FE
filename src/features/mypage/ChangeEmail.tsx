import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { useNavigate } from 'react-router-dom'

import ChangeEmailForm from './components/ChangeEmailForm'
import styles from './AccountPage.module.css'

export default function ChangeEmail() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
        subMain={
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>이메일 변경</h1>

            <p className={styles.pageDescription}>프로필 및 계정 정보를 관리하세요.</p>
          </div>
        }
      />

      <main className={styles.container}>
        <ChangeEmailForm onUnauthorized={() => navigate('/login', { replace: true })} />
      </main>
    </>
  )
}
