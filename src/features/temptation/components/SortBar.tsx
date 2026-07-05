import styles from '../TemptationMain.module.css';

type SortValue = '가나다순' | '마감일순';

interface SortTabsProps {
  selected: SortValue;
  onSelect: (value: SortValue) => void;
}

const SORT_OPTIONS: SortValue[] = ['가나다순', '마감일순'];

export const SortTabs = ({ selected, onSelect }: SortTabsProps) => {
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {SORT_OPTIONS.map((option) => {
        return (
          <button
            className={`${styles.sortBar} ${selected === option ? styles.active : ''}`}
            key={option}
            onClick={() => onSelect(option)}>
            {option}
          </button>
        );
      })}
    </div>
  );
};