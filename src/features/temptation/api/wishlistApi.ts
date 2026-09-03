import client from '@/api/client'
import type { Product } from '../types'
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'
import { getWishlistErrorKind } from '../utils/wishlistErrors'

interface WishlistItemResponse {
  id: string
  userId: string
  categoryCode: string
  productName: string
  productUrl: string | null
  price: string | null
  productImageUrl: string | null
  reason: string | null
  waitType: string
  waitUntil: string | null
  status: string
  createdAt: string
  updatedAt: string
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

const WAIT_TYPE_MAP: Record<string, (typeof TIME_OPTIONS)[number]> = {
  '1H': '1시간',
  '1D': '1일',
  '3D': '3일',
  '1W': '7일',
}

const TIME_TO_WAIT_TYPE_MAP: Record<(typeof TIME_OPTIONS)[number], string> = {
  '1시간': '1H',
  '1일': '1D',
  '3일': '3D',
  '7일': '1W',
}

const DEFAULT_WAIT_HOURS = 24

const mapToProduct = (item: WishlistItemResponse): Product => {
  const createdAt = new Date(item.createdAt)

  return {
    id: item.id,
    name: item.productName,
    price: item.price ? Number(item.price) : 0,
    time: item.waitUntil
      ? new Date(item.waitUntil)
      : new Date(createdAt.getTime() + DEFAULT_WAIT_HOURS * 60 * 60 * 1000),
    timeOption: WAIT_TYPE_MAP[item.waitType] ?? '1일',
    category: CATEGORY_CODE_MAP[item.categoryCode] ?? '기타',
    link: item.productUrl ?? null,
    reason: item.reason ?? null,
    createdAt,
  }
}

const wishlistErrorHandling = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request()
  } catch (error) {
    const kind = getWishlistErrorKind(error)
    if (kind) {
      throw new Error(kind, { cause: error })
    }
    throw error
  }
}

export const fetchWishlistItems = async (): Promise<Product[]> => {
  const { data } = await client.get<WishlistItemsApiResponse>('/api/v1/wishlist-items')
  return data.data.map(mapToProduct)
}

export const fetchWishlistItem = async (id: string): Promise<Product> => {
  return wishlistErrorHandling(async () => {
    const { data } = await client.get<WishlistItemApiResponse>(`/api/v1/wishlist-items/${id}`)
    return mapToProduct(data.data)
  })
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

export const updateWishlistItem = async (id: string, formData: WishFormData): Promise<Product> => {
  return wishlistErrorHandling(async () => {
    const { data } = await client.patch<WishlistItemApiResponse>(`/api/v1/wishlist-items/${id}`, {
      categoryCode: CATEGORY_TO_CODE_MAP[formData.category],
      productName: formData.name,
      productUrl: formData.link,
      price: formData.price,
      reason: formData.reason,
      waitType: TIME_TO_WAIT_TYPE_MAP[formData.time],
    })
    return mapToProduct(data.data)
  })
}

export const deleteWishlistItem = async (id: string): Promise<void> => {
  return wishlistErrorHandling(async () => {
    await client.delete(`/api/v1/wishlist-items/${id}`)
  })
}
