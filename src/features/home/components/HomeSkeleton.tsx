import Skeleton, { SkeletonGroup } from '@/shared/components/Skeleton'
import styles from './HomeSkeleton.module.css'

export default function HomeSkeleton() {
  return (
    <SkeletonGroup label="홈 정보 불러오는 중" className={styles.wrapper}>
      <div className={styles.banner}>
        <div className={styles.bannerText}>
          <Skeleton width={96} height={14} />
          <Skeleton width={170} height={24} />
          <Skeleton width={130} height={24} />
          <Skeleton width={150} height={14} />
        </div>
        <Skeleton width={120} height={96} radius={48} />
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <Skeleton width={120} height={22} />
          <div className={styles.row}>
            <Skeleton height={112} radius={16} />
            <Skeleton height={112} radius={16} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.titleRow}>
            <Skeleton width={120} height={22} />
            <Skeleton width={64} height={18} />
          </div>
          <Skeleton height={236} radius={16} />
        </div>

        <Skeleton height={148} radius={16} />

        <div className={styles.section}>
          <Skeleton width={110} height={22} />
          <Skeleton height={88} radius={16} />
          <Skeleton height={88} radius={16} />
        </div>
      </div>
    </SkeletonGroup>
  )
}
