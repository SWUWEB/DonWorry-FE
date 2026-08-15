import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import KakaoButton from './KakaoButton'
import LoginLink from './LoginLink'
import ErrorMessage from './ErrorMessage'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import styles from './LoginForm.module.css'
import { useLogin } from '@/hooks/useLogin'
import { useKakaoLogin } from '@/hooks/useKakaoLogin'

export default function LoginForm() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const { mutate, isPending } = useLogin()
  const { mutate: kakaoLogin } = useKakaoLogin()

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
          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('refreshToken', response.data.refreshToken)

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

  const handleKakaoLogin = () => {
    kakaoLogin(
      {
        // TODO: 추후 OAuth 연동 시 실제 authorizationCode로 교체
        authorizationCode: '',
      },
      {
        onSuccess: (response) => {
          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('refreshToken', response.data.refreshToken)

          navigate('/')
        },

        onError: (error) => {
          if (!isAxiosError(error)) {
            alert('카카오 로그인에 실패했습니다.')
            return
          }

          const status = error.response?.status

          switch (status) {
            case 400:
              alert('카카오 계정 정보가 올바르지 않습니다.')
              break

            case 401:
              alert('카카오 인증 코드가 만료되었거나 올바르지 않습니다.')
              break

            case 409: {
              const data = error.response?.data as {
                message: string
                data: {
                  linkingToken: string
                  verificationMethods: string[]
                  expiresInSeconds: number
                }
              }

              localStorage.setItem('linkingToken', data.data.linkingToken)

              alert(data.message)
              break
            }

            case 502:
              alert('카카오 서버와 통신에 실패했습니다.')
              break

            default:
              alert('카카오 로그인에 실패했습니다.')
          }
        },
      },
    )
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
