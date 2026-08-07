import styles from './SignUpLink.module.css'

export default function SignUpLink() {
  return (
    <p className={styles.text}>
      아직 계정이 없으신가요?
      <span className={styles.link}> 회원가입</span>
    </p>
  )
}
