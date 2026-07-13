import styles from './ErrorMessage.module.css'

type ErrorMessageProps = {
  message: string
  type?: 'error' | 'success'
}

export default function ErrorMessage({
  message,
  type = 'error',
}: ErrorMessageProps) {
  return (
    <p
      className={
        type === 'success'
          ? styles.success
          : styles.error
      }
    >
      {message}
    </p>
  )
}