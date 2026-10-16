import { useNavigate } from 'react-router-dom'
import { IoChevronBack } from 'react-icons/io5'
import styles from './HeaderBackButton.module.css'

interface HeaderBackButtonProps {
  onClick?: () => void
}

export default function HeaderBackButton({ onClick }: HeaderBackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick ?? (() => navigate(-1))}
      aria-label="뒤로 가기"
    >
      <IoChevronBack size={20} />
    </button>
  )
}
