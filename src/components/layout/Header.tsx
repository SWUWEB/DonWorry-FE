import styles from "./Header.module.css";

interface HeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;

  subLeft?: React.ReactNode;
  subRight?: React.ReactNode;
  subMain?: React.ReactNode;
}

export default function Header({
  title,
  left,
  right,
  subLeft,
  subRight,
  subMain
}: HeaderProps) {
  const hasSubContent = Boolean(subLeft || subRight || subMain);
    
  return (
    <header className={styles.header}>
      {/* topBar: 최상단 헤더(Logo, 알림 아이콘, 햄버거 메뉴 등) */}
      <div className={styles.topBar}>
        <div className={styles.left}>
          {left}
        </div>

        {title && <h1 className={styles.title}>
          {title}
        </h1>}

        <div className={styles.right}>
          {right}
        </div>
      </div>  
        
      {/* subContent: 하위 헤더(뒤로가기 아이콘, 페이지별 내용 등) */}
      { hasSubContent && (
        <div className={styles.subContent}>
          <div className={styles.subTop}>
            <div className={styles.subLeft}>
              {subLeft}
            </div>
            <div />
            {/* subRight: 필요할 경우 넣을 우측 요소 */}
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