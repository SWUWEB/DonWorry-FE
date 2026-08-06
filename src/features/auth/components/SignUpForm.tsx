import { Link, useNavigate } from 'react-router-dom'
import InputField from '@/shared/components/InputField'
import Button from '@/shared/components/Button'
import { useState } from 'react'
import styles from './SignUpForm.module.css'
import ErrorMessage from './ErrorMessage'


export default function SignUpForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [id, setId] = useState('')

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')

  const [phone, setPhone] = useState('')

  const isValidId = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/.test(id)
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password)
  const isPasswordMatch = password === passwordCheck
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhone = /^(01[016789])-?\d{3,4}-?\d{4}$/.test(phone)

  const canSubmit =
    name.trim() !== '' &&
    isValidId &&
    isValidEmail &&
    isValidPassword &&
    isPasswordMatch &&
    isValidPhone

  const handleSubmit = () => {
    if (!canSubmit) return
    navigate('/onboarding')
  }


  return (
    <>
    <div className={styles.formField}>
      <InputField
        label="이름"
        placeholder="이름을 입력해주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      </div>


    <div className={styles.formField}>
      <InputField
        label="아이디"
        placeholder="영문, 숫자 조합 6~12자"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      {id.length > 0 && (

  <ErrorMessage
    type={isValidId ? 'success' : 'error'}
    message={
      isValidId
        ? '올바른 아이디 형식입니다.'
        : '영문, 숫자 조합 6~12자로 입력해주세요.'
    }
  />
)}
</div>


      <div className={styles.inputWithButton}>
       <label
         htmlFor="email"
         className={styles.label}
       > 
         이메일
       </label>

       <div className={styles.row}>
        <input
          id="email"
          className={styles.input}
          placeholder="dontworry@google.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

       <button
        type="button"
        className={styles.smallButton}
        disabled={!isValidEmail}
       >
        인증하기
       </button>
    </div>
  </div>


  {email.length > 0 && (
  <ErrorMessage
    type={isValidEmail ? 'success' : 'error'}
    message={
      isValidEmail
        ? '올바른 이메일 형식입니다.'
        : '올바른 이메일 형식이 아닙니다.'
    }
  />
)}


      <div className={styles.inputWithButton}>
       <label
         htmlFor="verificationCode"
         className={styles.label}
       >
         인증번호
       </label>

       <div className={styles.row}>
         <input
          id="verificationCode"
          className={styles.input}
          placeholder="인증번호를 입력해주세요"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

    <button
      type="button"
      className={styles.confirmButton}
      disabled={!code.trim()}
    >
     확인
    </button>
  </div>
</div>

    <div className={styles.formField}>
      <InputField
        label="비밀번호"
        placeholder="영문, 숫자, 특수문자 조합 8자 이상"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {password.length > 0 && (
  <ErrorMessage
    type={isValidPassword ? 'success' : 'error'}
    message={
      isValidPassword
        ? '올바른 비밀번호입니다.'
        : '비밀번호가 조건을 만족하지 않습니다.'
    }
  />
)}
</div>

    <div className={styles.formField}>
      <InputField
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력해주세요"
        type="password"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
      />

      {password.length > 0 && passwordCheck.length > 0 && (
        <ErrorMessage
          type={isPasswordMatch ? 'success' : 'error'}
          message={
          isPasswordMatch
            ? '비밀번호가 일치합니다.'
            : '비밀번호가 일치하지 않습니다.'
          }
        />
      )}
    </div>


    <div className={styles.formField}>
      <InputField
        label="전화번호"
        placeholder="010-0000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />



      {phone.length > 0 && (
        <ErrorMessage
          type={isValidPhone ? 'success' : 'error'}
          message={
            isValidPhone
              ? '올바른 전화번호 형식입니다.'
              : '010-0000-0000 형식으로 입력해주세요.'
          }
        />
      )}
      </div>

      <div className={styles.buttonGroup}>
  <Button onClick={handleSubmit} disabled={!canSubmit}>
    회원가입
  </Button>
</div>

<p className={styles.loginLink}>
  이미 계정이 있으신가요?
  <Link
    to="/login"
    className={styles.loginLinkText}
  >
    로그인
  </Link>
</p>
    </>
  )
}