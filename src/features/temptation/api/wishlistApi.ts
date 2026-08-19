import client from '@/api/client'
import type { Product } from '../types'
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'

interface WishlistItemResponse {
  id: string
  userId: string
  categoryCode: string
  productName: string
  productUrl: string
  price: string
  productImageUrl: string
  reason: string
  waitType: string
  waitUntil: string
  status: string
}

interface WishlistItemsApiResponse {
  success: boolean
  data: WishlistItemResponse[]
}

interface WishlistItemApiResponse {
  success: boolean
  data: WishlistItemResponse
}

const CATEGORY_CODE_MAP: Record<string, (typeof CATEGORIES)[number]> = {
  FASHION: '패션',
  BEAUTY: '뷰티',
  FOOD_SNACK: '음식',
  CAFE_DESSERT: '카페/디저트',
  HOBBY_GOODS: '취미/굿즈',
  ELECTRONICS: '전자기기',
  HEALTH_FITNESS: '건강/운동',
  TRAVEL: '여행',
  ETC: '기타',
}

const CATEGORY_TO_CODE_MAP: Record<(typeof CATEGORIES)[number], string> = {
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

// TODO: 아래 날짜 형식이 맞는지 확인 필요 (1H, ONE_DAY만 확인됨)
const WAIT_TYPE_MAP: Record<string, (typeof TIME_OPTIONS)[number]> = {
  '1H': '1시간',
  ONE_DAY: '1일',
  THREE_DAYS: '3일',
  ONE_WEEK: '7일',
}

const TIME_TO_WAIT_TYPE_MAP: Record<(typeof TIME_OPTIONS)[number], string> = {
  '1시간': '1H',
  '1일': 'ONE_DAY',
  '3일': 'THREE_DAYS',
  '7일': 'ONE_WEEK',
}

const mapToProduct = (item: WishlistItemResponse): Product => {
  return {
    id: item.id,
    name: item.productName,
    price: Number(item.price),
    time: new Date(item.waitUntil),
    timeOption: WAIT_TYPE_MAP[item.waitType] ?? '1일',
    category: CATEGORY_CODE_MAP[item.categoryCode] ?? '기타',
    link: item.productUrl,
    reason: item.reason,
    createdAt: new Date(item.waitUntil),
  }
}

export const fetchWishlistItems = async (): Promise<Product[]> => {
  const { data } = await client.get<WishlistItemsApiResponse>('/api/v1/wishlist-items')
  return data.data.map(mapToProduct)
}

export const addWishlistItem = async (formData: WishFormData): Promise<Product> => {
  const { data } = await client.post<WishlistItemApiResponse>('/api/v1/wishlist-items', {
    categoryCode: CATEGORY_TO_CODE_MAP[formData.category],
    productName: formData.name,
    productUrl: formData.link,
    price: formData.price,
    reason: formData.reason,
    waitType: TIME_TO_WAIT_TYPE_MAP[formData.time],
  })
  return mapToProduct(data.data)
}
