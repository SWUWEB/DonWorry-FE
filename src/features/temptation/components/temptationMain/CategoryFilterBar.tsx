import { CATEGORIES } from '@/constants/product';
import TabGroup from '@/shared/components/TabGroup';
import type { FilterValue } from '@/features/temptation/types';

interface CategoryFilterTabsProps {
  selected: FilterValue;
  onSelect: (value: FilterValue) => void;
  className?: string;
}

const FILTER_OPTIONS: FilterValue[] = ['전체', ...CATEGORIES];

export const CategoryFilterTabs = ({ selected, onSelect, className }: CategoryFilterTabsProps) => {
  return (
    <TabGroup
      variant="chipScroll"
      className={className}
      options={FILTER_OPTIONS}
      value={selected}
      onChange={onSelect}
    />
  );
};
