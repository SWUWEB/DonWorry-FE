import { SearchProductItem } from './SearchProductItem';
import type { Product } from '@/features/temptation/types';
import styles from './SearchProductItem.module.css'

interface SearchResultProps {
  products: Product[];
  keyword: string;
}

export const SearchResult = ({ products, keyword }: SearchResultProps) => {
  return (
    <div className={styles.list}>
      {products.length === 0 ? (
        <p className={styles.empty}>검색 결과가 없습니다</p>
      ) : (
        products.map((product) => (
          <SearchProductItem key={product.id} product={product} keyword={keyword} />
        ))
      )}
    </div>
  );
};