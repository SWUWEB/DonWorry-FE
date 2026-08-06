import { HiChevronRight } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

import styles from './AccountMenu.module.css'

const menus = [
  {
    title: '이메일 변경',
    path: '/changeemail',
  },
  {
    title: '비밀번호 변경',
    path: '/changepassword',
  },
  {
    title: '회원 탈퇴',
    path: '/withdraw',
  },
]

export default function AccountMenu() {
    const navigate = useNavigate()

  return (
    <section className={styles.card}>
      {menus.map((menu) => (
        <button
          key={menu.title}
          type="button"
          className={`${styles.menuButton} ${menu.title === '회원 탈퇴' ? styles.withdraw : ''}`}
          onClick={() => navigate(menu.path)}
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