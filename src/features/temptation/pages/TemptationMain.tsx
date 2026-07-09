import { useWishlist } from '../hooks/useWishlist';
import { CategoryFilterTabs } from '../components/temptationMain/CategoryFilterBar';
import { SortTabs } from '../components/temptationMain/SortBar';
import { CategoryProductBox } from '../components/temptationMain/CategoryProductBox';
import styles from './TemptationMain.module.css';
import { BiPlus } from "react-icons/bi";

interface TemptationMainProps {
  keyword?: string;
}

export default function TemptationMain({ keyword = '' }: TemptationMainProps) {
  const {
    filter,
    setFilter,
    sort,
    setSort,
    filteredProducts,
    categoriesToRender,
    handleDelete,
  } = useWishlist(keyword);

  const handleAddClick = () => {
    console.log('상품 추가 클릭');
  };

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

      <button className={styles.addBtn} onClick={handleAddClick}>
        <BiPlus size={45} />
      </button>
    </div>
  );
}