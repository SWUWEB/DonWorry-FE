import styles from './SignUp.module.css'
import SignUpForm from './components/SignUpForm'

export default function SignUp() {
  return (
    <main className={styles.container}>
      <div className={styles.authWrapper}>

        <section className={styles.topSection}>
          <div className={styles.logo}>Logo</div>

          <h1 className={styles.title}>시작해볼까요?</h1>

          <p className={styles.description}>
            간단한 정보 입력 후
            <br />
            돈워리의 모든 기능을 이용해보세요.
          </p>
        </section>

        <section className={styles.card}>
          <SignUpForm />
        </section>

      </div>
    </main>
  )
}