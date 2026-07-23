import { HiChevronRight } from 'react-icons/hi'

import styles from './AccountMenu.module.css'

const menus = [
  {
    title: '이메일 변경',
  },
  {
    title: '비밀번호 변경',
  },
  {
    title: '회원 탈퇴', 
  },
]

export default function AccountMenu() {
  return (
    <section className={styles.card}>
      {menus.map((menu) => (
        <button
          key={menu.title}
          type="button"
          className={`${styles.menuButton} ${menu.title === '회원 탈퇴' ? styles.withdraw : ''}`}
        >
          <span>{menu.title}</span>

          <HiChevronRight
            size={20}
            className={styles.icon}
          />
        </button>
      ))}
    </section>
  )
}