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

export type CategoryLabel = (typeof CATEGORIES)[number]

export const CATEGORY_LABEL_TO_CODE = {
  패션: 'FASHION',
  뷰티: 'BEAUTY',
  음식: 'FOOD_SNACK',
  '카페/디저트': 'CAFE_DESSERT',
  '취미/굿즈': 'HOBBY_GOODS',
  전자기기: 'ELECTRONICS',
  '건강/운동': 'HEALTH_FITNESS',
  여행: 'TRAVEL',
  기타: 'ETC',
} as const satisfies Record<CategoryLabel, string>

export type CategoryCode = (typeof CATEGORY_LABEL_TO_CODE)[CategoryLabel]

export const CATEGORY_CODE_TO_LABEL = Object.fromEntries(
  Object.entries(CATEGORY_LABEL_TO_CODE).map(([label, code]) => [code, label]),
) as Record<CategoryCode, CategoryLabel>

export const TIME_OPTIONS = ['1시간', '1일', '3일', '7일'] as const
