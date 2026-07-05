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
    <div style={{ marginBottom: '20px' }}>
      <div className={styles.productCategory}>
        <CategoryIcon category={category} />
        <span className={styles.category}>{category}</span>
      </div>

      <div className={styles.productContainer}>
        {products.map((product, index) => (
          <div key={product.id} style={index > 0 ? { borderTop: '1.5px solid #DDDDDD' } : undefined}>
            <ProductItem product={product} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
};