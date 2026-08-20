import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import KakaoButton from './KakaoButton'
import LoginLink from './LoginLink'
import ErrorMessage from './ErrorMessage'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import styles from './LoginForm.module.css'
import { useLogin } from '@/hooks/useLogin'
import { saveAuthSession } from '@/shared/auth/session'
import { getKakaoAuthorizeUrl } from '../kakaoOAuth'

export default function LoginForm() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const { mutate, isPending } = useLogin()

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()

    if (!id.trim()) {
      setErrorMessage('아이디를 입력해주세요.')
      return
    }

    if (!password.trim()) {
      setErrorMessage('비밀번호를 입력해주세요.')
      return
    }

    setErrorMessage('')

    mutate(
      {
        loginId: id,
        password,
      },
      {
        onSuccess: (response) => {
          saveAuthSession(response.data)

          navigate('/')
        },

        onError: (error) => {
          const status = isAxiosError(error) ? error.response?.status : undefined

          setErrorMessage(
            status === 401
              ? '아이디 또는 비밀번호가 올바르지 않습니다.'
              : '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
          )
        },
      },
    )
  }

  // 카카오 동의 화면으로 리다이렉트합니다. 인증 코드는 카카오가 redirect_uri로
  // 돌려보내주는 콜백(KakaoCallback)에서 받아 처리합니다.
  const handleKakaoLogin = () => {
    try {
      window.location.href = getKakaoAuthorizeUrl()
    } catch {
      // 카카오 앱 키/Redirect URI 환경변수가 비어있는 등 설정 누락 시 조용히 실패하지 않도록 안내합니다.
      setErrorMessage('카카오 로그인을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <form className={styles.container} onSubmit={handleLogin}>
      <InputField
        label="아이디"
        placeholder="아이디를 입력해주세요"
        value={id}
        onChange={(e) => {
          setId(e.target.value)
          setErrorMessage('')
        }}
      />

      <div className={styles.passwordSection}>
        <InputField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrorMessage('')
          }}
        />
        {errorMessage && <ErrorMessage message={errorMessage} />}
      </div>

      <p className={styles.findLinks}>
        <Link to="/find-id" className={styles.findLink}>
          아이디 찾기
        </Link>
        <span className={styles.divider} aria-hidden="true" />
        <Link to="/reset-password" className={styles.findLink}>
          비밀번호 재설정
        </Link>
      </p>

      <div className={styles.buttonGroup}>
        <Button type="submit" disabled={isPending}>
          {isPending ? '로그인 중...' : '로그인'}
        </Button>

        <KakaoButton onClick={handleKakaoLogin} />
      </div>

      <LoginLink />
    </form>
  )
}
