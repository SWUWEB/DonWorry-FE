import { useId, type ChangeEvent } from 'react'
import styles from './InputField.module.css'


type InputFieldProps = {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
};

export default function InputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: InputFieldProps)  {
    const inputId = useId()


  return (
    <div className={styles.container}>
      <label
  htmlFor={inputId}
  className={styles.label}
>
  {label}
</label>
      <input
      id={inputId}
      className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    </div>
  )
}