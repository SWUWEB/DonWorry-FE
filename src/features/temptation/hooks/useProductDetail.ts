import { MOCK_PRODUCTS } from '../mockData';
import type { Product } from '../types';

// TODO: 백엔드 API 연동 시 실제 상품 단건 조회 API로 교체
export const useProductDetail = (id: string): Product | undefined => {
  return MOCK_PRODUCTS.find((p) => p.id === id);
};