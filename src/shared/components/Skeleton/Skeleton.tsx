import type { CSSProperties, ReactNode } from 'react'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  circle?: boolean
  className?: string
}

// 콘텐츠 자리를 표시하는 회색 블록입니다. 스크린리더에는 감싸는 SkeletonGroup의 라벨만 읽힙니다.
export default function Skeleton({
  width = '100%',
  height = 16,
  radius = 6,
  circle = false,
  className,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.skeleton} ${className ?? ''}`}
      style={{ width, height, borderRadius: circle ? '50%' : radius }}
    />
  )
}

interface SkeletonGroupProps {
  label: string
  className?: string
  children: ReactNode
}

// 로딩 중임을 한 번만 알리도록 스켈레톤 묶음을 status 영역으로 감쌉니다.
export function SkeletonGroup({ label, className, children }: SkeletonGroupProps) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className={className}>
      {children}
    </div>
  )
}
