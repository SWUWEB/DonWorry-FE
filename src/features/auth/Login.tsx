import styles from './Login.module.css'
import LoginForm from './components/LoginForm'
import LoginHeader from './components/LoginHeader'

export default function Login() {
  return (
    <main className={styles.container}>
      <div className={styles.authWrapper}>
        <LoginHeader
          className={styles.topSection}
          title="환영합니다!"
          description={`소비하기 전, 잠깐 멈추고 
나를 위한 선택을 시작해보세요.`}
        />

        <section className={styles.card}>
          <LoginForm />
        </section>
      </div>
    </main>
  )
}
