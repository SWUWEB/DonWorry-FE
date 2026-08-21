import styles from './KakaoButton.module.css'
import KakaoIcon from '@/assets/Path.svg'

interface KakaoButtonProps {
  onClick: () => void
}

export default function KakaoButton({ onClick }: KakaoButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <img src={KakaoIcon} alt="카카오" className={styles.icon} />
      카카오로 시작하기
    </button>
  )
}
