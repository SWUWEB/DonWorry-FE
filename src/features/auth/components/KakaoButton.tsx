import styles from './KakaoButton.module.css'
import KakaoIcon from '@/assets/Path.svg'

export default function KakaoButton() {
  return (
    <button
      type="button"
      className={styles.button}
    >
      <img
        src={KakaoIcon}
        alt="카카오"
        className={styles.icon}
      />
      카카오로 시작하기
    </button>
  )
}