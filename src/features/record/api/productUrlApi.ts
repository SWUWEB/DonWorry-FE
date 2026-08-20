import client from '@/api/client'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ParsedProduct {
  productName: string
  price: number
  occurredAt: string
}

export const productUrlApi = {
  parse: async (productUrl: string): Promise<ParsedProduct> => {
    const { data } = await client.post<ApiResponse<ParsedProduct>>('/api/v1/product-url/parse', {
      productUrl,
    })
    return data.data
  },
}
