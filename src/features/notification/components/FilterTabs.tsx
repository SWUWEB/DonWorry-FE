import TabGroup from '@/shared/components/TabGroup'

export type FilterType = '전체' | '일반' | '목표현황' | '유혹관리'

const TABS: { label: string; value: FilterType }[] = [
  { label: '전체', value: '전체' },
  { label: '일반', value: '일반' },
  { label: '목표', value: '목표현황' },
  { label: '유혹관리', value: '유혹관리' },
]

interface FilterTabsProps {
  active: FilterType
  onChange: (value: FilterType) => void
}

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  return <TabGroup variant="segment" options={TABS} value={active} onChange={onChange} />
}
