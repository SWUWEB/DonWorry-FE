import InputField from './InputField'
import PrimaryButton from './PrimaryButton'
import KakaoButton from './KakaoButton'
import LoginLink from './LoginLink'
import ErrorMessage from './ErrorMessage'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginForm.module.css'


export default function LoginForm() {
const [id, setId] = useState('')
const [password, setPassword] = useState('')

const navigate = useNavigate()

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


  navigate('/')
}


  return (
    <form
      className={styles.container}
      onSubmit={handleLogin}
    >
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
    <ErrorMessage message="비밀번호가 일치하지 않습니다." />
  </div>
      
     

      <div className={styles.buttonGroup}>
      <PrimaryButton type="submit">
          로그인
      </PrimaryButton>   

     <KakaoButton />
     </div>

  <LoginLink />
</form>
  )
}