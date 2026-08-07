import { useId, useState, type ChangeEvent, type ReactNode } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import styles from './InputField.module.css'

type InputFieldProps = {
  label: string
  id?: string
  name?: string
  placeholder?: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  error?: string
  helper?: string
  rightElement?: ReactNode
  maxLength?: number
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'search' | 'none' | 'decimal' | 'url'
  pattern?: string
  autoComplete?: string
  readOnly?: boolean
  className?: string
}

export default function InputField({
  label,
  id,
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helper,
  rightElement,
  maxLength,
  inputMode,
  pattern,
  autoComplete,
  readOnly,
  className,
}: InputFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
  const trailing = isPassword ? (
    <button
      type="button"
      className={styles.trailingButton}
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label={showPassword ? `${label} 숨기기` : `${label} 보기`}
    >
      {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
    </button>
  ) : (
    rightElement
  )

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          name={name}
          className={`${styles.input} ${trailing ? styles.hasTrailing : ''}`}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          autoComplete={autoComplete}
          readOnly={readOnly}
        />
        {trailing && <span className={styles.trailing}>{trailing}</span>}
      </div>

      {error ? (
        <p className={styles.errorText}>{error}</p>
      ) : helper ? (
        <p className={styles.helperText}>{helper}</p>
      ) : null}
    </div>
  )
}
