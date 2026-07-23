import { CATEGORIES } from '@/constants/product';

export type Category = typeof CATEGORIES[number];

export interface Product {
  id: string;
  name: string;
  price: number;
  time: Date;
  category: Category;
  link?: string;
  reason?: string;
}

export type FilterValue = '전체' | Category;
export type SortValue = '가나다순' | '마감일순';