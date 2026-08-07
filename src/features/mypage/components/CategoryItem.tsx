import styles from './CategoryItem.module.css'

interface CategoryItemProps {
  color: string
  name: string
  amount: string
  percent: string
}

export default function CategoryItem({
  color,
  name,
  amount,
  percent,
}: CategoryItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <span
          className={styles.dot}
          style={{ backgroundColor: color }}
        />

        <span className={styles.name}>
          {name}
        </span>
      </div>

      <div className={styles.info}>
        <span className={styles.amount}>
          {amount}
        </span>

        <span className={styles.percent}>
          ({percent})
        </span>
      </div>
    </div>
  )
}