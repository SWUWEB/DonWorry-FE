import styles from './AmountInput.module.css'

interface AmountInputProps {
  id?: string
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  className?: string
  disabled?: boolean
}

export default function AmountInput({
  id,
  value,
  onChange,
  onBlur,
  className,
  disabled,
}: AmountInputProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <input
        id={id}
        className={styles.input}
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={value === 0 ? '' : value.toLocaleString('ko-KR')}
        onBlur={onBlur}
        disabled={disabled}
        onChange={(event) => {
          const raw = event.target.value.replace(/[^0-9]/g, '')
          onChange(raw === '' ? 0 : Number(raw))
        }}
      />
      <span className={styles.currency}>원</span>
    </div>
  )
}
