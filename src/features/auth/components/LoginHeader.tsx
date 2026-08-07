import styles from '../Login.module.css'
import logo from '@/assets/logos/donworry_simple_logo.svg'

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
      <img src={logo} alt="DonWorry" className={styles.logo} />

      <h1 className={styles.title}>{title}</h1>

      <p className={styles.description}>
        {description}
      </p>
    </section>
  )
}
