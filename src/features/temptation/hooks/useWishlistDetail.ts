import { useQuery } from '@tanstack/react-query'
import { fetchWishlistItem } from '../api/wishlistApi'
import { isUnauthorizedError } from '@/shared/utils/isUnauthorizedError'
import { getMutationErrorKind } from '../utils/wishlistErrors'

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
    retry: false,
  })

  const isUnauthorized = isUnauthorizedError(error)
  const errorKind = getMutationErrorKind(error)

  return {
    product,
    isLoading,
    isError,
    isUnauthorized,
    errorKind,
  }
}
