import { useMutation } from '@tanstack/react-query'
import { productUrlApi } from '../api/productUrlApi'

export function useParseProductUrl() {
  return useMutation({
    mutationFn: productUrlApi.parse,
  })
}
