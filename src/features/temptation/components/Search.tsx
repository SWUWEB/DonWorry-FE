import { SearchResult } from './SearchResult';
import styles from './Search.module.css';
import type { Product } from '../types';

interface SearchProps {
  keyword: string;
  filteredProducts: Product[];
}

export const Search = ({ keyword, filteredProducts }: SearchProps) => {
  return (
    <div className={styles.search}>
      <div className={styles.topLine}>
        <p className={styles.wishlistCount}>
          참고 있는 유혹 <strong className={styles.wishlistCountNumber}>{filteredProducts.length}</strong>
        </p>
      </div>

      <SearchResult products={filteredProducts} keyword={keyword} />
    </div>
  );
};