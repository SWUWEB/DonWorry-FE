import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product'
import type { Category, FilterValue, SortValue } from '../types'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'
import { fetchWishlistItems, addWishlistItem, updateWishlistItem } from '../api/wishlistApi'
import { isUnauthorizedError } from '../utils/isUnauthorizedError'

export const useWishlist = () => {
  const queryClient = useQueryClient()

  const {
    data: serverProducts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['wishlistItems'],
    queryFn: fetchWishlistItems,
  })

  // 연동 전 API에 대한 임시 방편
  // 연동 후 해당 부분 삭제, serverProducts를 직접 사용하도록 변경
  const [localOverrides, setLocalOverrides] = useState<{ deletedIds: Set<string> }>({
    deletedIds: new Set(),
  })

  const products = useMemo(() => {
    return serverProducts.filter((p) => !localOverrides.deletedIds.has(p.id))
  }, [serverProducts, localOverrides])

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

  const handleDelete = (id: string) => {
    console.warn(`API 연동 전! (id: ${id}) 다음 이슈에서 작업 예정`)
    setLocalOverrides((prev) => ({
      deletedIds: new Set(prev.deletedIds).add(id),
    }))
  }

  const handleAdd = (formData: WishFormData) => {
    addMutation.mutate(formData)
  }

  const extendMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: WishFormData }) =>
      updateWishlistItem(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistItems'] })
    },
  })

  const handleExtend = (id: string, timeOption: (typeof TIME_OPTIONS)[number]) => {
    const target = products.find((p) => p.id === id)
    if (!target) return

    extendMutation.mutate({
      id,
      formData: {
        link: target.link ?? undefined,
        price: target.price,
        name: target.name,
        category: target.category,
        time: timeOption,
        reason: target.reason ?? '',
      },
    })
  }

  const editMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: WishFormData }) =>
      updateWishlistItem(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistItems'] })
    },
  })

  const handleEdit = (id: string, formData: WishFormData) => {
    editMutation.mutate({ id, formData })
  }

  const categoriesToRender: Category[] = filter === '전체' ? [...CATEGORIES] : [filter]

  const isUnauthorized =
    isUnauthorizedError(error) ||
    isUnauthorizedError(addMutation.error) ||
    isUnauthorizedError(editMutation.error) ||
    isUnauthorizedError(extendMutation.error)

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
    isEditing: editMutation.isPending,
    isEditSuccess: editMutation.isSuccess,
    isEditError: editMutation.isError,
    resetEditStatus: editMutation.reset,
    isExtending: extendMutation.isPending,
    isExtendSuccess: extendMutation.isSuccess,
    isExtendError: extendMutation.isError,
    resetExtendStatus: extendMutation.reset,
    isUnauthorized,
    handleDelete,
    handleAdd,
    handleExtend,
    handleEdit,
  }
}
