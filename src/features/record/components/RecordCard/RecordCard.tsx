import { Link } from "react-router-dom";
import styles from "./RecordCard.module.css";

export type RecordType = "saved" | "consume";

interface RecordCardProps {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: RecordType;
  thumbnail?: string;
}

export default function RecordCard({
  id,
  title,
  category,
  amount,
  type,
  thumbnail,
}: RecordCardProps) {
  return (
    <Link to={`/record/${id}`} className={styles.card}>
      <div className={styles.left}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.thumbnail} />
        ) : (
          <div className={styles.thumbnailPlaceholder} />
        )}

        <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          <p className={styles.category}>{category}</p>
        </div>
      </div>

      <p
        className={`${styles.amount} ${
          type === "saved" ? styles.saved : styles.consume
        }`}
      >
        {type === "saved" ? "+" : "-"} {amount.toLocaleString()}원
      </p>
    </Link>
  );
}
