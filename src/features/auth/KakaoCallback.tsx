import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { kakaoLogin } from '@/api/auth'
import { shouldRetryRequest } from '@/api/queryClient'
import type { KakaoLinkRequiredResponse } from '@/api/auth'
import Header from '@/components/layout/Header'
import HomeSkeleton from '@/features/home/components/HomeSkeleton'
import { onboardingApi } from '@/features/onboarding/api/onboardingApi'
import Button from '@/shared/components/Button'
import ErrorMessage from './components/ErrorMessage'
import LoginHeader from './components/LoginHeader'
import { getKakaoLoginErrorMessage, isKakaoLinkRequired } from './kakaoErrors'
import { consumeKakaoState } from './kakaoOAuth'
import { clearAuthSession, getAccessToken, saveAuthSession } from '@/shared/auth/session'
import { SESSION_EXPIRED_NOTICE } from '@/shared/auth/redirect'
import styles from './Login.module.css'

export default function KakaoCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
      .then(async (response) => {
        saveAuthSession(response.data)

        try {
          const onboarding = await queryClient.fetchQuery({
            queryKey: ['onboarding'],
            queryFn: onboardingApi.get,
            staleTime: 0,
            // 로그인 후 경로 확인은 한 번만 재시도하며, 전역 4xx 재시도 금지를 유지합니다.
            retry: (failureCount, error) =>
              failureCount < 1 && shouldRetryRequest(failureCount, error),
          })
          const hasOnboarded = Boolean(
            onboarding.interestTags?.length ||
            onboarding.savingGoalText ||
            onboarding.targetSavingAmount,
          )
          navigate(hasOnboarded ? '/' : '/onboarding', { replace: true })
        } catch (error: unknown) {
          if (isAxiosError(error) && error.response?.status === 401) {
            // 토큰이 로그인 응답과 달라졌다면 재발급은 성공했지만 재시도 요청도 401을 받은 것이라
            // 인터셉터가 세션을 지우지 않습니다. 재발급이 일시적으로 실패한 경우는 세션을 유지합니다.
            const accessToken = getAccessToken()
            if (accessToken && accessToken !== response.data.accessToken) {
              clearAuthSession()
            }
            navigate('/login', {
              replace: true,
              state: { notice: SESSION_EXPIRED_NOTICE },
            })
            return
          }

          setErrorMessage('온보딩 정보를 확인하지 못했습니다. 잠시 후 다시 로그인해주세요.')
        }
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
  }, [searchParams, navigate, queryClient])

  if (!errorMessage) {
    // 로그인과 온보딩 확인 중에는 홈 화면의 뼈대를 먼저 보여줍니다.
    // 아직 로그인 전이라 헤더 버튼 등이 눌리지 않도록 inert로 막습니다.
    return (
      <div role="status" aria-label="카카오 로그인 처리 중" className={styles.kakaoPending}>
        <div inert className={styles.kakaoPending}>
          <Header />
          <HomeSkeleton />
        </div>
      </div>
    )
  }

  return (
    <main className={styles.container}>
      <div className={styles.authWrapper}>
        <LoginHeader
          className={styles.topSection}
          title="카카오 로그인"
          description="로그인을 완료하지 못했어요."
        />

        <section className={styles.card}>
          <ErrorMessage message={errorMessage} />
          <Button onClick={() => navigate('/login', { replace: true })}>로그인으로 돌아가기</Button>
        </section>
      </div>
    </main>
  )
}
