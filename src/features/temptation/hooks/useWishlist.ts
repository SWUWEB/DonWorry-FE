import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/constants/product';
import type { Category, Product, FilterValue, SortValue } from '../types';
import { MOCK_PRODUCTS } from '../mockData';
import type { FormData as WishFormData } from '@/components/layout/ProductForm';

const TIME_TO_HOURS: Record<string, number> = {
  '1시간': 1,
  '1일': 24,
  '3일': 72,
  '7일': 168,
};

const timeStringToDate = (time: string): Date => {
  const hours = TIME_TO_HOURS[time] ?? 24;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

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

  const handleAdd = (formData: WishFormData) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),  // 백엔드 연동 시 발급받은 고유 id 할당
      name: formData.name,
      price: formData.price,
      time: timeStringToDate(formData.time),
      category: formData.category as Category,
    };
    setProducts((prev) => [...prev, newProduct]);
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
    handleAdd,
  };
};