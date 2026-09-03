import { useEffect } from 'react'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import Button from '@/shared/components/Button'
import NotFoundPage from './NotFoundPage'
import styles from './RouteErrorPage.module.css'

// 배포로 번들 파일 이름이 바뀌면, 이전 버전을 열어둔 탭은 존재하지 않는 청크를 받으러 갑니다.
// 브라우저마다 문구가 달라 메시지로 판별합니다.
const CHUNK_LOAD_ERROR_PATTERN =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i

function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return CHUNK_LOAD_ERROR_PATTERN.test(message)
}

export default function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    console.error('처리되지 않은 라우트 오류', error)
  }, [error])

  // 실제로 없는 경로는 기존 404 화면을 그대로 보여줍니다.
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }

  const isChunkError = isChunkLoadError(error)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isChunkError ? '새 버전이 배포되었어요' : '문제가 발생했어요'}
      </h1>
      <p className={styles.description}>
        {isChunkError
          ? '새로고침하면 최신 화면으로 이어서 사용할 수 있어요.'
          : '잠시 후 다시 시도해주세요. 계속 이 화면이 보이면 알려주세요.'}
      </p>

      <div className={styles.actions}>
        <Button onClick={() => window.location.reload()}>새로고침</Button>
        {!isChunkError && (
          <Button variant="outline" onClick={() => navigate('/')}>
            홈으로 가기
          </Button>
        )}
      </div>
    </div>
  )
}
