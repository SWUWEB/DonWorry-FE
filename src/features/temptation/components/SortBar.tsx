import styles from '../TemptationMain.module.css';
import type { SortValue } from '../types';

interface SortTabsProps {
  selected: SortValue;
  onSelect: (value: SortValue) => void;
}

const SORT_OPTIONS: SortValue[] = ['가나다순', '마감일순'];

export const SortTabs = ({ selected, onSelect }: SortTabsProps) => {
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {SORT_OPTIONS.map((option) => {
        const isSelected = selected === option;

        return (
          <button
            className={`${styles.sortBar} ${isSelected ? styles.active : ''}`}
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