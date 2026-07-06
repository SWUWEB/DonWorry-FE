import styles from './LoginLink.module.css'

export default function LoginLink() {
  return (
    <p className={styles.text}>
      이미 계정이 있으신가요?
      <span> 로그인</span>
    </p>
  )
}