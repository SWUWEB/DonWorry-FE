import { SearchProductItem } from './SearchProductItem';
import type { Product } from '../types';
import styles from './SearchProductItem.module.css'

interface SearchResultProps {
  products: Product[];
  keyword: string;
}

export const SearchResult = ({ products, keyword }: SearchResultProps) => {
  return (
    <div className={styles.list}>
      {products.map((product) => (
        <SearchProductItem key={product.id} product={product} keyword={keyword} />
      ))}
    </div>
  );
};