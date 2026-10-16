import { createContext, useContext } from 'react'
import type { useWishlist } from './useWishlist'

type WishlistContextValue = ReturnType<typeof useWishlist>

export const WishlistContext = createContext<WishlistContextValue | null>(null)

export const useWishlistContext = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlistContext는 WishlistProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
