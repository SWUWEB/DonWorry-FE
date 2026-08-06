import styles from './MenuItem.module.css'
import { Icon } from '@iconify/react'

type MenuItemProps = {
  title: string
  icon: string
  onClick?: () => void
}

export default function MenuItem({
  title,
  icon,
  onClick,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={`${styles.item} ${!onClick ? styles.itemDisabled : ''}`}
      onClick={onClick}
      disabled={!onClick}
    >
      <div className={styles.left}>
        <Icon
          icon={icon}
          className={styles.icon}
        />

        <span className={styles.title}>
          {title}
        </span>
      </div>

      <span className={styles.arrow}>›</span>
    </button>
  )
}