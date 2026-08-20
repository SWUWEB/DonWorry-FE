export const CATEGORIES = [
  '패션',
  '뷰티',
  '음식',
  '카페/디저트',
  '취미/굿즈',
  '전자기기',
  '건강/운동',
  '여행',
  '기타',
] as const

export const TIME_OPTIONS = ['1시간', '1일', '3일', '7일'] as const

// 백엔드에 실제로 존재하는 카테고리 코드로 확인된 값만 매핑합니다.
export const CATEGORY_LABEL_TO_CODE: Record<string, string> = {
  패션: 'FASHION',
  뷰티: 'BEAUTY',
  음식: 'FOOD_SNACK',
  '카페/디저트': 'CAFE_DESSERT',
  '취미/굿즈': 'HOBBY_GOODS',
  전자기기: 'ELECTRONICS',
  '건강/운동': 'HEALTH_FITNESS',
  여행: 'TRAVEL',
  기타: 'ETC',
}
