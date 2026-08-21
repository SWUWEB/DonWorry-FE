import { useNavigate } from 'react-router-dom'
import styles from './ProfileCard.module.css'
import ProfileIcon from '@/assets/profile.svg'

type ProfileCardProps = {
  name: string
  subtitle?: string
  profileImageUrl?: string | null
}

export default function ProfileCard({ name, subtitle, profileImageUrl }: ProfileCardProps) {
  const navigate = useNavigate()

  return (
    <section className={styles.card}>
      <div className={styles.avatar}>
        <img
          src={profileImageUrl || ProfileIcon}
          alt="프로필"
          className={`${styles.avatarIcon} ${profileImageUrl ? styles.avatarPhoto : ''}`}
        />
      </div>

      <h2 className={styles.name}>{name}</h2>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <button type="button" className={styles.manageButton} onClick={() => navigate('/profile')}>
        회원 정보 관리
      </button>
    </section>
  )
}
