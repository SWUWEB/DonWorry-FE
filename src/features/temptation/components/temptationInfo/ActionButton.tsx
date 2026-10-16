import styles from './ActionButton.module.css'

interface ActionButtonProps {
  onEdit: () => void
  onGiveUp: () => void
}

export const ActionButton = ({ onEdit, onGiveUp }: ActionButtonProps) => {
  return (
    <div className={styles.wrapper}>
      <button className={styles.editBtn} onClick={onEdit}>
        수정하기
      </button>
      <button className={styles.giveUpBtn} onClick={onGiveUp}>
        포기하기
      </button>
    </div>
  )
}
