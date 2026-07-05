import { CATEGORIES } from '@/constants/product';

export type Category = typeof CATEGORIES[number];

export interface Product {
  id: string;
  name: string;
  price: number;
  time: Date;
  category: Category;
}