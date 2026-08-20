import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { kakaoLogin } from '@/api/auth'
import type { KakaoLinkRequiredResponse } from '@/api/auth'
import Button from '@/shared/components/Button'
import ErrorMessage from './components/ErrorMessage'
import LoginHeader from './components/LoginHeader'
import { getKakaoLoginErrorMessage, isKakaoLinkRequired } from './kakaoErrors'
import { consumeKakaoState } from './kakaoOAuth'
import styles from './Login.module.css'

export default function KakaoCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  // StrictMode 이중 마운트/재렌더로 인증 코드가 두 번 소진되는 것을 막습니다
  // (카카오 인증 코드는 1회용이라 재사용 시 401이 납니다).
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (hasRequestedRef.current) return

    const code = searchParams.get('code')
    const kakaoError = searchParams.get('error')

    if (kakaoError) {
      // URL 쿼리(외부 상태)를 최초 1회 화면 상태로 반영합니다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage('카카오 로그인이 취소되었습니다.')
      return
    }

    if (!code) {
      setErrorMessage('잘못된 접근입니다.')
      return
    }

    if (!consumeKakaoState(searchParams.get('state'))) {
      setErrorMessage('로그인 요청이 올바르지 않습니다. 처음부터 다시 시도해주세요.')
      return
    }

    hasRequestedRef.current = true

    // react-query useMutation의 per-call 콜백은 StrictMode의 effect 이중 실행과
    // 맞물리면 응답이 와도 onSuccess/onError가 호출되지 않는 경우가 있어(재현 확인됨),
    // 마운트 시 1회만 실행되는 이 흐름은 API 함수를 직접 호출해 처리합니다.
    kakaoLogin({ authorizationCode: code })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        navigate('/', { replace: true })
      })
      .catch((error: unknown) => {
        // 409는 AUTH4093(계정 연결 필요) 외에 AUTH4094(이미 다른 계정에 연결된 카카오 계정)도
        // 공유하는 상태코드라, HTTP status가 아니라 code로 구분해야 합니다.
        if (isKakaoLinkRequired(error) && isAxiosError(error)) {
          const body = error.response?.data as KakaoLinkRequiredResponse | undefined
          const linkingToken = body?.data?.linkingToken

          if (linkingToken) {
            navigate('/auth/kakao/link', {
              replace: true,
              state: {
                linkingToken,
                verificationMethods: body.data.verificationMethods,
              },
            })
            return
          }
        }

        setErrorMessage(getKakaoLoginErrorMessage(error))
      })
  }, [searchParams, navigate])

  return (
    <main className={styles.container}>
      <div className={styles.authWrapper}>
        <LoginHeader
          className={styles.topSection}
          title="카카오 로그인"
          description={errorMessage ? '로그인에 실패했어요.' : '로그인 처리 중이에요...'}
        />

        <section className={styles.card}>
          {errorMessage && (
            <>
              <ErrorMessage message={errorMessage} />
              <Button onClick={() => navigate('/login', { replace: true })}>
                로그인으로 돌아가기
              </Button>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
