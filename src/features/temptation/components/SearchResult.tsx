import { SearchProductItem } from './SearchProductItem';
import type { Product } from '../types';

interface SearchResultProps {
  products: Product[];
  keyword: string;
}

export const SearchResult = ({ products, keyword }: SearchResultProps) => {
  return (
    <div>
      {products.map((product) => (
        <SearchProductItem key={product.id} product={product} keyword={keyword} />
      ))}
    </div>
  );
};