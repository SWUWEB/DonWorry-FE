import { CATEGORIES } from '@/constants/product';
import styles from '../TemptationMain.module.css';

type FilterValue = '전체' | typeof CATEGORIES[number];

interface CategoryFilterTabsProps {
  selected: FilterValue;
  onSelect: (value: FilterValue) => void;
}

const FILTER_OPTIONS: FilterValue[] = ['전체', ...CATEGORIES];

export const CategoryFilterTabs = ({ selected, onSelect }: CategoryFilterTabsProps) => {
  return (
    <div className={styles.chipContainer}>
      {FILTER_OPTIONS.map((option) => {
        return (
          <button
            className={`${styles.chip} ${selected === option ? styles.chipSelected : ''}`}
            key={option}
            onClick={() => onSelect(option)}>
            {option}
          </button>
        );
      })}
    </div>
  );
};