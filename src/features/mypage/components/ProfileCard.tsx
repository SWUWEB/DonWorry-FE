import { useNavigate } from 'react-router-dom'
import styles from './ProfileCard.module.css'
import ProfileIcon from '@/assets/profile.svg'

type ProfileCardProps = {
  name: string
  subtitle?: string
}

export default function ProfileCard({ name, subtitle }: ProfileCardProps) {
  const navigate = useNavigate()

  return (
    <section className={styles.card}>
      <div className={styles.avatar}>
        <img src={ProfileIcon} alt="프로필" className={styles.avatarIcon} />
      </div>

      <h2 className={styles.name}>{name}</h2>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <button type="button" className={styles.manageButton} onClick={() => navigate('/profile')}>
        회원 정보 관리
      </button>
    </section>
  )
}
