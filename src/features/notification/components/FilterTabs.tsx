import styles from './FilterTabs.module.css'

export type FilterType = '전체' | '일반' | '목표현황' | '재판단'

const TABS: { label: string; value: FilterType }[] = [
  { label: '전체 보기', value: '전체' },
  { label: '일반 알림', value: '일반' },
  { label: '목표 현황 알림', value: '목표현황' },
  { label: '재판단 알림', value: '재판단' },
]

interface FilterTabsProps {
  active: FilterType
  onChange: (value: FilterType) => void
}

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className={styles.tabs}>
      {TABS.map(tab => (
        <button
          key={tab.value}
          className={`${styles.tab} ${active === tab.value ? styles.active : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
