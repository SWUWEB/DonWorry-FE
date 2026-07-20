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
      >
        회원 정보 관리
      </button>
    </section>
  )
}