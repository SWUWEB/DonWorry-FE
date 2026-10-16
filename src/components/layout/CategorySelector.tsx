import { CATEGORIES } from '@/constants/product'
import styles from './CategorySelector.module.css'

export type Category = (typeof CATEGORIES)[number]

interface CategorySelectorProps {
  value: Category
  onChange: (value: Category) => void
  name?: string
  className?: string
}

export default function CategorySelector({
  value,
  onChange,
  name = 'category',
  className,
}: CategorySelectorProps) {
  return (
    <div className={`${styles.chipGroup} ${className ?? ''}`} role="radiogroup">
      {CATEGORIES.map((category) => (
        <label
          key={category}
          className={`${styles.chip} ${value === category ? styles.chipSelected : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={category}
            className={styles.hidden}
            checked={value === category}
            onChange={() => onChange(category)}
          />
          {category}
        </label>
      ))}
    </div>
  )
}
