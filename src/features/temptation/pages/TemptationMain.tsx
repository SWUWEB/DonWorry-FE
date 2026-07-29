import { useWishlistContext } from '../hooks/WishlistContext';
import { CategoryFilterTabs } from '../components/temptationMain/CategoryFilterBar';
import { SortTabs } from '../components/temptationMain/SortBar';
import { CategoryProductBox } from '../components/temptationMain/CategoryProductBox';
import styles from './TemptationMain.module.css';
import { BiPlus } from "react-icons/bi";
import { useState } from 'react';
import { BottomAdd } from '../components/temptationAdd/ProductAdd';
import { ProductForm } from '@/components/layout/ProductForm';
import type { FormData as WishFormData } from '@/components/layout/ProductForm';

export default function TemptationMain() {
  const {
    filter,
    setFilter,
    sort,
    setSort,
    filteredProducts,
    categoriesToRender,
    handleDelete,
    handleAdd,
  } = useWishlistContext();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const handleWishAdd = (data: WishFormData) => {
    handleAdd(data);
    setIsAddOpen(false);
  }

  return (
    <div className={styles.temptationMain}>
      <CategoryFilterTabs selected={filter} onSelect={setFilter} />

      <div className={styles.topLine}>
        <p style={{ margin: 0 }}>
          참고 있는 유혹 <strong style={{ color: '#389698', fontWeight: 'bold' }}>
            {filteredProducts.length}</strong>
        </p>
        <div className={styles.sortContainer}>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>정렬 기준</span>
          <SortTabs selected={sort} onSelect={setSort} />
        </div>
      </div>

      {categoriesToRender.map((category) => (
        <CategoryProductBox
          key={category}
          category={category}
          products={filteredProducts.filter((p) => p.category === category)}
          onDelete={handleDelete}
        />
      ))}

      <button className={styles.addBtn} onClick={() => setIsAddOpen(true)}>
        <BiPlus size={45} />
      </button>

      <BottomAdd isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div className={styles.bottomSheet}>
          <ProductForm formId="add-wishlist-form" onSubmit={handleWishAdd} />
          <button
            type="submit"
            form="add-wishlist-form"
            className={styles.sheetBtn}
            >
            위시리스트에 저장하기
          </button>
        </div>
      </BottomAdd>
    </div>
  );
}