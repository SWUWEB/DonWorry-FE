import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/constants/product';
import type { Category, Product, FilterValue, SortValue } from '../types';
import { MOCK_PRODUCTS } from '../mockData';

export const useWishlist = (keyword: string = '') => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filter, setFilter] = useState<FilterValue>('전체');
  const [sort, setSort] = useState<SortValue>('가나다순');

  const filteredProducts = useMemo(() => {
    let target = filter === '전체' ? products : products.filter((p) => p.category === filter);

    if (keyword.trim()) {
      target = target.filter((p) => p.name.toLowerCase().includes(keyword.trim().toLowerCase()));
    }

    return [...target].sort((a, b) => {
      if (sort === '가나다순') return a.name.localeCompare(b.name, 'ko');
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.getTime() - b.time.getTime();
    });
  }, [products, filter, sort, keyword]);

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const categoriesToRender: Category[] = filter === '전체' ? [...CATEGORIES] : [filter];

  return {
    filter,
    setFilter,
    sort,
    setSort,
    filteredProducts,
    categoriesToRender,
    handleDelete,
  };
};