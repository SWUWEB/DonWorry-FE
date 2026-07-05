import { formatRemainingTime } from '../utils/formatTimer';
import type { Product } from '../types';
import styles from '../TemptationMain.module.css'

interface ProductItemProps {
  product: Product;
  onDelete: (id: string) => void;
}

export const ProductItem = ({ product, onDelete }: ProductItemProps) => {
  const { id, name, price, time } = product;

  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemInfo}>
        <div>
          <p>{name}</p>
          <p className={styles.itemPrice}>{price.toLocaleString()}원</p>
        </div>
        <button className={styles.deleteBtn} onClick={() => onDelete(id)}>
          ✕
        </button>
      </div>
      <p className={styles.itemTimer}>
        남은 대기 시간 {formatRemainingTime(time)}
      </p>
    </div>
  );
};