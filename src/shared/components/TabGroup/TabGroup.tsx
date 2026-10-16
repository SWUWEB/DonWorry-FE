import styles from './TabGroup.module.css'

interface TabOption<T extends string> {
  label: string
  value: T
}

type TabGroupProps<T extends string> = {
  options: readonly T[] | readonly TabOption<T>[]
  value: T
  onChange: (value: T) => void
  variant?: 'chip' | 'chipScroll' | 'segment' | 'segmentPill' | 'underline'
  className?: string
}

function toOption<T extends string>(option: T | TabOption<T>): TabOption<T> {
  return typeof option === 'string' ? { label: option, value: option } : option
}

export default function TabGroup<T extends string>({
  options,
  value,
  onChange,
  variant = 'chip',
  className,
}: TabGroupProps<T>) {
  return (
    <div
      className={`${styles.group} ${styles[variant]} ${className ?? ''}`}
      role={variant === 'chip' || variant === 'chipScroll' ? 'radiogroup' : undefined}
    >
      {options.map((option) => {
        const { label, value: optionValue } = toOption(option)
        const isSelected = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
            aria-pressed={isSelected}
            onClick={() => onChange(optionValue)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
