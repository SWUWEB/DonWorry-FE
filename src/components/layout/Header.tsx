import { IoNotifications } from 'react-icons/io5'
import { useDrawer } from '@/features/drawer/useDrawer'
import styles from "./Header.module.css";

interface HeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onBellClick?: () => void;
  unreadCount?: number;

  subLeft?: React.ReactNode;
  subTitle?: string;
  subRight?: React.ReactNode;
  subMain?: React.ReactNode;
}

function TwoLineMenu() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
      <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="0" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export default function Header({
  title,
  left,
  right,
  onBellClick,
  unreadCount = 0,
  subLeft,
  subTitle,
  subRight,
  subMain
}: HeaderProps) {
  const hasSubContent = Boolean(subLeft || subRight || subMain || subTitle);
  const { open: openDrawer } = useDrawer()

  const defaultRight = (
    <>
      <button className={styles.iconBtn} aria-label="알림" onClick={onBellClick}>
        <span className={styles.bellWrap}>
          <IoNotifications size={20} />
          {unreadCount > 0 && <span className={styles.badge} />}
        </span>
      </button>
      <button className={styles.iconBtn} aria-label="메뉴" onClick={openDrawer}>
        <TwoLineMenu />
      </button>
    </>
  )

  return (
    <header className={styles.header}>
        <div className={styles.topBar}>
            <div className={styles.left}>
                {left}
            </div>

            {title && <h1 className={styles.title}>{title}</h1>}

            <div className={styles.right}>
                {right ?? defaultRight}
            </div>
        </div>

        { hasSubContent && (
           <div className={styles.subContent}>
                <div className={styles.subTop}>
                    <div className={styles.subLeft}>
                        {subLeft}
                    </div>
                    {subTitle
                      ? <h2 className={styles.subTitle}>{subTitle}</h2>
                      : <div />
                    }
                    <div className={styles.subRight}>
                        {subRight}
                    </div>
                </div>

                <div className={styles.subMain}>
                    {subMain}
                </div>
            </div>
        )}
    </header>
  );
}
