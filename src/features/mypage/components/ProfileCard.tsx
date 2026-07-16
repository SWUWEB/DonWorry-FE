import styles from './ProfileCard.module.css'
import ProfileIcon from '@/assets/profile.svg'

export default function ProfileCard() {
  return (
    <section className={styles.card}>
      <div className={styles.avatar}>
        <img
          src={ProfileIcon}
          alt="프로필"
          className={styles.avatarIcon}
        />

</div>

      <h2 className={styles.name}>000님</h2>

      <p className={styles.email}>
        donworry@gmail.com
      </p>

      <span className={styles.manageText}>
       회원 정보 관리
      </span>
    </section>
  )
}