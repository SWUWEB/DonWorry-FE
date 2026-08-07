import { useNavigate } from 'react-router-dom'
import styles from './ProfileCard.module.css'
import ProfileIcon from '@/assets/profile.svg'

type ProfileCardProps = {
  name: string
  email: string
}

export default function ProfileCard({
  name,
  email,
}: ProfileCardProps) {
  const navigate = useNavigate()

  return (
    <section className={styles.card}>
      <div className={styles.avatar}>
        <img
          src={ProfileIcon}
          alt="프로필"
          className={styles.avatarIcon}
        />

</div>

      <h2 className={styles.name}>{name}</h2>

      <p className={styles.email}>
        {email}
      </p>

      <button
        type="button"
        className={styles.manageButton}
        onClick={() => navigate('/profile')}
      >
        회원 정보 관리
      </button>
    </section>
  )
}