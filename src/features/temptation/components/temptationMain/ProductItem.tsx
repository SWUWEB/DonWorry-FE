import { IoClose } from 'react-icons/io5';
import { formatRemainingTime } from '../../utils/formatTimer';
import type { Product } from '@/features/temptation/types';
import { formatKRW } from '@/shared/utils/currency';
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
    <div className={styles.itemContainer}>
      <button
        type="button"
        className={styles.itemMain}
        onClick={handleClick}
        aria-label={`${name} 상세 보기`}>
        <p className={styles.itemName}>{name}</p>
        <div className={styles.itemBottom}>
          <span className={styles.itemPrice}>{formatKRW(price)}</span>
          <span className={styles.itemTimer}>남은 대기 시간 {formatRemainingTime(time)}</span>
        </div>
      </button>
      <button
        type="button"
        className={styles.deleteBtn}
        aria-label="상품 삭제"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}>
        <IoClose size={18} />
      </button>
    </div>
  );
};
