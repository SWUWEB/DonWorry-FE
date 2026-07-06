import styles from './KakaoButton.module.css'

export default function KakaoButton() {
  return (
    <button className={styles.button}>
      <span className={styles.icon}>💬</span>
      <span>카카오 로그인</span>
    </button>
  )
}