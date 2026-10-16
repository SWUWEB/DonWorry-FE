import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import Skeleton, { SkeletonGroup } from '@/shared/components/Skeleton'
import styles from './WishlistSkeleton.module.css'

// 위시리스트 목록: 카테고리 묶음 2개 × 상품 2개
export function WishlistListSkeleton() {
  return (
    <SkeletonGroup label="위시리스트 불러오는 중">
      <div className={styles.topLine}>
        <Skeleton width={110} height={16} />
        <Skeleton width={120} height={16} />
      </div>
      {[0, 1].map((box) => (
        <div key={box} className={styles.productBox}>
          <div className={styles.category}>
            <Skeleton width={36} height={36} circle />
            <Skeleton width={56} height={16} />
          </div>
          <div className={styles.productContainer}>
            {[0, 1].map((item) => (
              <div key={item} className={styles.productItem}>
                <Skeleton width="60%" height={16} />
                <div className={styles.productBottom}>
                  <Skeleton width={72} height={14} />
                  <Skeleton width={120} height={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </SkeletonGroup>
  )
}

interface WishlistDetailSkeletonProps {
  backTo: string
  variant?: 'info' | 'edit'
}

// 상품 상세·수정 화면: 목록을 불러오는 동안 "상품을 찾을 수 없습니다"가 잠깐 보이지 않게 뼈대를 보여줍니다.
export function WishlistDetailSkeleton({ backTo, variant = 'info' }: WishlistDetailSkeletonProps) {
  const navigate = useNavigate()

  return (
    <SkeletonGroup label="상품 정보 불러오는 중">
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton onClick={() => navigate(backTo)} />}
        subMain={
          <div className={styles.infoHeader}>
            <Skeleton width={55} height={55} circle />
            <div className={styles.infoText}>
              <Skeleton width={55} height={22} radius={11} />
              <Skeleton width={160} height={22} />
            </div>
          </div>
        }
      />
      <div className={styles.wrapper}>
        {variant === 'info' ? (
          <>
            <Skeleton height={120} radius={16} />
            <Skeleton height={180} radius={16} />
            <div className={styles.buttonRow}>
              <Skeleton height={52} radius={26} />
              <Skeleton height={52} radius={26} />
            </div>
          </>
        ) : (
          [48, 48, 48, 48, 100].map((height, i) => (
            <div key={i} className={styles.field}>
              <Skeleton width={90} height={14} />
              <Skeleton height={height} radius={12} />
            </div>
          ))
        )}
      </div>
    </SkeletonGroup>
  )
}

// 재판단 화면: 헤더 문구는 고정이라 그대로 두고 본문만 뼈대로 보여줍니다.
export function WishlistJudgeSkeleton({ headerText }: { headerText: ReactNode }) {
  const navigate = useNavigate()

  return (
    <SkeletonGroup label="상품 정보 불러오는 중">
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton onClick={() => navigate('/temptation')} />}
        subMain={headerText}
      />
      <div className={styles.wrapper}>
        <Skeleton height={64} radius={12} />
        <Skeleton height={110} radius={16} />
        <Skeleton height={190} radius={16} />
        <Skeleton height={160} radius={16} />
      </div>
    </SkeletonGroup>
  )
}
