import { CATEGORIES } from '@/constants/product';
import styles from '../../pages/TemptationMain.module.css';
import type { FilterValue } from '@/features/temptation/types';

interface CategoryFilterTabsProps {
  selected: FilterValue;
  onSelect: (value: FilterValue) => void;
}

const FILTER_OPTIONS: FilterValue[] = ['전체', ...CATEGORIES];

export const CategoryFilterTabs = ({ selected, onSelect }: CategoryFilterTabsProps) => {
  return (
    <div className={styles.chipContainer}>
      {FILTER_OPTIONS.map((option) => {
        const isSelected = selected === option;
        return (
          <button
            className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
            key={option}
            aria-pressed={isSelected}
            onClick={() => onSelect(option)}>
            {option}
          </button>
        );
      })}
    </div>
  );
};