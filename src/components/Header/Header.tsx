import styles from "./Header.module.css";

interface HeaderProps {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export default function Header({
  title,
  left,
  right,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {left}
      </div>

      <h1 className={styles.title}>
        {title}
      </h1>

      <div className={styles.right}>
        {right}
      </div>
    </header>
  );
}