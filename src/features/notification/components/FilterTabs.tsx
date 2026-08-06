import TabGroup from '@/shared/components/TabGroup'

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
  return <TabGroup variant="segment" options={TABS} value={active} onChange={onChange} />
}
