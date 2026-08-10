import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import KakaoButton from './KakaoButton'
import LoginLink from './LoginLink'
import ErrorMessage from './ErrorMessage'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginForm.module.css'
import { useLogin } from '@/hooks/useLogin'

export default function LoginForm() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  const navigate = useNavigate()
  const { mutate } = useLogin()

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()

    if (!id.trim()) {
      alert('아이디를 입력해주세요.')
      return
    }

    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    mutate(
      {
        loginId: id,
        password,
      },
      {
        onSuccess: (response) => {
          setLoginError(false)
          console.log(response)

          localStorage.setItem('accessToken', response.data.accessToken)

          localStorage.setItem('refreshToken', response.data.refreshToken)

          navigate('/')
        },

        onError: (error) => {
          setLoginError(true)
          console.error(error)
          alert('아이디 또는 비밀번호가 올바르지 않습니다.')
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
        onChange={(e) => setId(e.target.value)}
      />

      <div className={styles.passwordSection}>
        <InputField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loginError && <ErrorMessage message="비밀번호가 일치하지 않습니다." />}
      </div>

      <div className={styles.buttonGroup}>
        <Button type="submit">로그인</Button>

        <KakaoButton />
      </div>

      <LoginLink />
    </form>
  )
}
