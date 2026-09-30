import { useWishlistContext } from '../hooks/WishlistContext'
import { CategoryFilterTabs } from '../components/temptationMain/CategoryFilterBar'
import { SortTabs } from '../components/temptationMain/SortBar'
import { CategoryProductBox } from '../components/temptationMain/CategoryProductBox'
import styles from './TemptationMain.module.css'
import { BiPlus } from 'react-icons/bi'
import { useState } from 'react'
import { BottomAdd } from '../components/temptationAdd/ProductAdd'
import { ProductForm } from '@/components/layout/ProductForm'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'
import { productUrlApi } from '../api/productUrlApi'
import { getProductUrlErrorMessage } from '../api/productUrlError'
import { WishlistListSkeleton } from '../components/skeleton/WishlistSkeleton'

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
    isLoading,
  } = useWishlistContext()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const handleWishAdd = (data: WishFormData) => {
    handleAdd(data)
    setIsAddOpen(false)
  }
  const handleFetchProductData = async (link: string) => {
    try {
      const response = await productUrlApi.parse(link)
      return { name: response.productName, price: response.price }
    } catch (err) {
      throw new Error(getProductUrlErrorMessage(err), { cause: err })
    }
  }

  return (
    <div className={styles.temptationMain}>
      <CategoryFilterTabs selected={filter} onSelect={setFilter} />

      {isLoading ? (
        <WishlistListSkeleton />
      ) : (
        <>
          <div className={styles.topLine}>
            <p className={styles.countText}>
              참고 있는 유혹{' '}
              <strong className={styles.countHighlight}>{filteredProducts.length}</strong>
            </p>
            <div className={styles.sortContainer}>
              <span className={styles.sortLabel}>정렬 기준</span>
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
        </>
      )}

      <button className={styles.addBtn} onClick={() => setIsAddOpen(true)}>
        <BiPlus size={45} />
      </button>

      <BottomAdd isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div className={styles.bottomSheet}>
          <ProductForm
            onFetchProductData={handleFetchProductData}
            formId="add-wishlist-form"
            onSubmit={handleWishAdd}
          />
          <button type="submit" form="add-wishlist-form" className={styles.sheetBtn}>
            위시리스트에 저장하기
          </button>
        </div>
      </BottomAdd>
    </div>
  )
}
