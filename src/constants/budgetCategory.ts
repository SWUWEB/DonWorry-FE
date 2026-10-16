import { CATEGORIES, CATEGORY_LABEL_TO_CODE } from './product'

export type CategoryLabel = (typeof CATEGORIES)[number]

export type CategoryCode =
  | 'FASHION'
  | 'BEAUTY'
  | 'FOOD_SNACK'
  | 'CAFE_DESSERT'
  | 'HOBBY_GOODS'
  | 'ELECTRONICS'
  | 'HEALTH_FITNESS'
  | 'TRAVEL'
  | 'ETC'

export const CATEGORY_CODE_TO_LABEL = Object.fromEntries(
  Object.entries(CATEGORY_LABEL_TO_CODE).map(([label, code]) => [code, label]),
) as Record<CategoryCode, CategoryLabel>
