import { useQuery } from '@tanstack/react-query'
import { fetchWishlistItem } from '../api/wishlistApi'
import { isUnauthorizedError } from '../utils/isUnauthorizedError'

export const useWishlistDetail = (id: string | undefined) => {
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['wishlistItem', id],
    queryFn: () => fetchWishlistItem(id as string),
    enabled: !!id,
  })

  const isUnauthorized = isUnauthorizedError(error)

  return {
    product,
    isLoading,
    isError,
    isUnauthorized,
  }
}
