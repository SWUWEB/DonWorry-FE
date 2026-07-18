import styles from './MenuItem.module.css'
import { Icon } from '@iconify/react'

type MenuItemProps = {
  title: string
  icon: string
}

export default function MenuItem({
  title,
  icon,
}: MenuItemProps) {
  return (
    <button className={styles.item}>
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