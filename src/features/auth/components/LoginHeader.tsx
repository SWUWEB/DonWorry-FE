import styles from './Login.module.css'

type LoginHeaderProps = {
  title: string
  description: string
  className?: string
}

export default function LoginHeader({
  title,
  description,
  className,
}: LoginHeaderProps) {
  return (
    <section className={className}>
      <div className={styles.logo}>Logo</div>

      <h1 className={styles.title}>{title}</h1>

      <p className={styles.description}>
        {description}
      </p>
    </section>
  )
}