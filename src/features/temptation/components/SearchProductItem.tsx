import { CategoryIcon } from '@/assets/icons/CategoryIcon';
import { formatRemainingTime } from '../utils/formatTimer';
import { highlightSearch } from '../utils/highlightSearch';
import type { Product } from '../types';
import styles from './SearchProductItem.module.css';

interface SearchProductItemProps {
  product: Product;
  keyword: string;
}

export const SearchProductItem = ({ product, keyword }: SearchProductItemProps) => {
  const { name, category, price, time } = product;

  return (
    <div className={styles.box}>
      <div className={styles.top}>
        <CategoryIcon category={category} size={34} />
        <div className={styles.info}>
          <p className={styles.name}>{highlightSearch(name, keyword)}</p>
          <p className={styles.meta}>{category} · {price.toLocaleString()}원</p>
        </div>
      </div>
      <p className={styles.time}>남은 대기 시간 {formatRemainingTime(time)}</p>
    </div>
  );
};