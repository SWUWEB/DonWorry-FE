import { CATEGORIES, TIME_OPTIONS } from '@/constants/product';

export type Category = typeof CATEGORIES[number];

export interface Product {
  id: string;
  name: string;
  price: number;
  time: Date;
  timeOption: typeof TIME_OPTIONS[number];
  category: Category;
  link?: string;
  reason?: string;
  createdAt: Date;
}

export type FilterValue = '전체' | Category;
export type SortValue = '가나다순' | '마감일순';