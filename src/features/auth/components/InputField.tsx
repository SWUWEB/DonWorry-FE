import styles from './InputField.module.css'

type InputFieldProps = {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: InputFieldProps)  {


  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      <input
  className={styles.input}
  type={type}
  placeholder={placeholder}
  value={value}
  onChange={onChange}
/>
    </div>
  )
}