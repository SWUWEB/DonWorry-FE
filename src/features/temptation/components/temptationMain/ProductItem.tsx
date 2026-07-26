import { formatRemainingTime } from '../../utils/formatTimer';
import type { Product } from '@/features/temptation/types';
import styles from './ProductItem.module.css';
import { useNavigate } from 'react-router-dom';

interface ProductItemProps {
  product: Product;
  onDelete: (id: string) => void;
}

export const ProductItem = ({ product, onDelete }: ProductItemProps) => {
  const navigate = useNavigate();
  const { id, name, price, time } = product;

  const handleClick = () => {
    navigate(`/temptation/${id}`);
  }

  return (
    <div className={styles.itemContainer} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={styles.itemInfo}>
        <div>
          <p>{name}</p>
          <p className={styles.itemPrice}>{price.toLocaleString()}원</p>
        </div>
        <button className={styles.deleteBtn} aria-label="상품 삭제" onClick={() => onDelete(id)}>
          ✕
        </button>
      </div>
      <p className={styles.itemTimer}>
        남은 대기 시간 {formatRemainingTime(time)}
      </p>
    </div>
  );
};