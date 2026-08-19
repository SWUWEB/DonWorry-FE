import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CATEGORIES } from '@/constants/product'
import type { Category, FilterValue, SortValue } from '../types'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'
import { fetchWishlistItems, addWishlistItem } from '../api/wishlistApi'
import { isUnauthorizedError } from '../utils/isUnauthorizedError'

export const useWishlist = () => {
  const queryClient = useQueryClient()

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['wishlistItems'],
    queryFn: fetchWishlistItems,
  })

  const [filter, setFilter] = useState<FilterValue>('전체')
  const [sort, setSort] = useState<SortValue>('가나다순')
  const [keyword, setKeyword] = useState('')

  const filteredProducts = useMemo(() => {
    let target = filter === '전체' ? products : products.filter((p) => p.category === filter)

    if (keyword.trim()) {
      target = target.filter((p) => p.name.toLowerCase().includes(keyword.trim().toLowerCase()))
    }

    return [...target].sort((a, b) => {
      if (sort === '가나다순') return a.name.localeCompare(b.name, 'ko')
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.getTime() - b.time.getTime()
    })
  }, [products, filter, sort, keyword])

  const addMutation = useMutation({
    mutationFn: addWishlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistItems'] })
    },
  })

  const handleDelete = (_id: string) => {
    console.warn(`삭제 API 연동 전! (id: ${_id}) 다음 이슈에서 작업 예정`)
  }

  const handleAdd = (formData: WishFormData) => {
    addMutation.mutate(formData)
  }

  const handleEdit = (_id: string, _formData: WishFormData, _timeChanged: boolean) => {
    console.warn(`수정 API 연동 전! (id: ${_id}, timeChanged: ${_timeChanged})`, _formData)
  }

  const categoriesToRender: Category[] = filter === '전체' ? [...CATEGORIES] : [filter]

  const isUnauthorized = isUnauthorizedError(error) || isUnauthorizedError(addMutation.error)

  return {
    keyword,
    setKeyword,
    filter,
    setFilter,
    sort,
    setSort,
    filteredProducts,
    categoriesToRender,
    isLoading,
    isError,
    isAdding: addMutation.isPending,
    isUnauthorized,
    handleDelete,
    handleAdd,
    handleEdit,
  }
}
