import styles from './LoginLink.module.css'

export default function LoginLink() {
  return (
    <p className={styles.text}>
      아직 계정이 없으신가요?
      <span> 회원가입</span>
    </p>
  )
}