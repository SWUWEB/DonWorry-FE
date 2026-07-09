import { IoMdSearch } from "react-icons/io";
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = '검색' }: SearchBarProps) {
  return (
    <div className={styles.searchBar}>
      <IoMdSearch className={styles.icon} size={25} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}