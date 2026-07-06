import styles from './Login.module.css'
import LoginForm from './components/LoginForm'

export default function Login() {
  return (
    <main className={styles.container}>
      <div className={styles.authWrapper}>

        <section className={styles.topSection}>
          <div className={styles.logo}>Logo</div>

          <h1 className={styles.title}>환영합니다!</h1>

          <p className={styles.description}>
            소비하기 전, 잠깐 멈추고
            <br />
            나를 위한 선택을 시작해보세요.
          </p>
        </section>

        <section className={styles.card}>
          <LoginForm />
        </section>

      </div>
    </main>
  )
}