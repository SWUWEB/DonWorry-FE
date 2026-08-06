import styles from './FilterChip.module.css'

interface FilterChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

export default function FilterChip({ label, selected = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
