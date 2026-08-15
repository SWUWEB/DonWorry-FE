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
          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('refreshToken', response.data.refreshToken)

          navigate('/')
        },

        onError: (error) => {
          // 401은 아이디/비밀번호 불일치, 그 외에는 일시적인 오류로 안내합니다.
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

        <KakaoButton />
      </div>

      <LoginLink />
    </form>
  )
}
