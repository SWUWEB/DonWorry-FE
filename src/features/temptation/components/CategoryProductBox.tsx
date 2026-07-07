import { CategoryIcon } from '@/assets/icons/CategoryIcon';
import { ProductItem } from './ProductItem';
import type { Product, Category } from '../types';
import styles from '../TemptationMain.module.css'

interface CategoryProductBoxProps {
  category: Category;
  products: Product[];
  onDelete: (id: string) => void;
}

export const CategoryProductBox = ({ category, products, onDelete }: CategoryProductBoxProps) => {
  if (products.length === 0) return null;

  return (
    <div className={styles.productBox}>
      <div className={styles.productCategory}>
        <CategoryIcon category={category} />
        <span className={styles.category}>{category}</span>
      </div>

      <div className={styles.productContainer}>
        {products.map((product, index) => (
          <div key={product.id} className={index > 0 ? styles.divider : undefined}>
            <ProductItem product={product} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
};