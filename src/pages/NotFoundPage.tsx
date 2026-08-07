import { useNavigate } from 'react-router-dom'
import Button from '@/shared/components/Button'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>페이지를 찾을 수 없어요</h1>
      <p className={styles.description}>
        요청하신 페이지가 존재하지 않거나 이동되었어요.
      </p>
      <Button onClick={() => navigate('/')}>홈으로 가기</Button>
    </div>
  )
}
