import InputField from './InputField'
import PrimaryButton from './PrimaryButton'
import KakaoButton from './KakaoButton'
import LoginLink from './LoginLink'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginForm.module.css'


export default function LoginForm() {
const [id, setId] = useState('')
const [password, setPassword] = useState('')
const handleLogin = () => {
  if (!id.trim()) {
    alert('아이디를 입력해주세요.')
    return
  }

  if (!password.trim()) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  console.log('아이디:', id)
  console.log('비밀번호:', password)

  navigate('/')
}
  const navigate = useNavigate()


  return (
    <div className={styles.container}>
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
  </div>
      
     

      <div className={styles.buttonGroup}>
      <PrimaryButton onClick={handleLogin}>
          로그인
      </PrimaryButton>   

     <KakaoButton />
     </div>

  <LoginLink />
</div>
  )
}