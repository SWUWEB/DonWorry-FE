import type { Product } from './types';

const hoursFromNow = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000);
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);

// 백엔드 연동 전까지 사용할 임시 데이터
export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: '스탠다드 유넥 반팔티', price: 21000, time: hoursFromNow(13), timeOption: '1일', createdAt: new Date(), category: '패션',
    reason: '반팔티가 필요해서', link: 'https://black-up.kr/product/123451234123412341234123412341234'
   },
  { id: '2', name: '와이드 데님 팬츠', price: 30000, time: hoursFromNow(48), timeOption: '3일', createdAt: new Date(), category: '패션',
   },
  { id: '3', name: '캔버스 크로스백', price: 45000, time: hoursFromNow(24), timeOption: '1일', createdAt: new Date(), category: '패션' },
  { id: '4', name: '생딸기 몽땅 요아정 (2인)', price: 14000, time: hoursFromNow(13), timeOption: '1일', createdAt: new Date(), category: '카페/디저트',
   },
  { id: '5', name: '두쫀쿠', price: 5000, time: hoursFromNow(24), timeOption: '1일', createdAt: new Date(), category: '카페/디저트' },
  { id: '6', name: '쏘내추럴 메이크업 세팅 픽서', price: 24000, time: hoursFromNow(72), timeOption: '3일', createdAt: new Date(), category: '뷰티' },
  {
    id: '7',
    name: '무선 이어폰 케이스',
    price: 18000,
    time: hoursAgo(1),           // 1시간 전에 이미 마감됨
    timeOption: '1일',
    createdAt: hoursAgo(25),      // 24시간(1일)짜리였는데, 25시간 전에 등록했으니 1시간 초과
    category: '전자기기',
    reason: '케이스가 낡아서',
    link: 'https://black-up.kr/product/98765',
  },
];

// 백엔드 연동 시 실제 삭제 요청으로 교체 필요
export const removeMockProduct = (id: string) => {
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PRODUCTS.splice(index, 1);
  }
};