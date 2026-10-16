import { useNavigate } from 'react-router-dom'
import Skeleton, { SkeletonGroup } from '@/shared/components/Skeleton'
import styles from './ProfileCard.module.css'
import ProfileIcon from '@/assets/profile.svg'

type ProfileCardProps = {
  name: string
  subtitle?: string
  profileImageUrl?: string | null
  isLoading?: boolean
}

export default function ProfileCard({
  name,
  subtitle,
  profileImageUrl,
  isLoading = false,
}: ProfileCardProps) {
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

      {isLoading ? (
        <SkeletonGroup label="회원 정보 불러오는 중" className={styles.skeleton}>
          <Skeleton width={90} height={18} />
          <Skeleton width={140} height={13} />
        </SkeletonGroup>
      ) : (
        <>
          <h2 className={styles.name}>{name}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </>
      )}

      <button type="button" className={styles.manageButton} onClick={() => navigate('/profile')}>
        회원 정보 관리
      </button>
    </section>
  )
}
