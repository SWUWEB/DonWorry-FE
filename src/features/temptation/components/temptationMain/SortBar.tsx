import TabGroup from '@/shared/components/TabGroup'
import type { SortValue } from '@/features/temptation/types'

interface SortTabsProps {
  selected: SortValue
  onSelect: (value: SortValue) => void
}

const SORT_OPTIONS: SortValue[] = ['가나다순', '마감일순']

export const SortTabs = ({ selected, onSelect }: SortTabsProps) => {
  return (
    <TabGroup variant="segmentPill" options={SORT_OPTIONS} value={selected} onChange={onSelect} />
  )
}
