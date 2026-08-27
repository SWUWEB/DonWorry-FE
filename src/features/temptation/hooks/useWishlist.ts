import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product'
import type { Category, FilterValue, SortValue, Product } from '../types'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'
import {
  fetchWishlistItems,
  addWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from '../api/wishlistApi'
import { isUnauthorizedError } from '../utils/isUnauthorizedError'
import { getMutationErrorKind } from '../utils/wishlistErrors'

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

  // 목록 캐시를 서버 재조회 없이 즉시 갱신합니다.
  // invalidateQueries만 쓰면 재조회가 끝나기 전까지 목록에 남은 이전 값(예: 지난 고민 시간)을
  // 상세/재판단 화면이 그대로 읽어 서로를 오가며 화면이 튀는 문제가 있었습니다.
  const patchWishlistItemCache = (updated: Product) => {
    queryClient.setQueryData<Product[]>(['wishlistItems'], (old) =>
      old?.map((p) => (p.id === updated.id ? updated : p)),
    )
    queryClient.invalidateQueries({ queryKey: ['wishlistItems'] })
  }

  const deleteMutation = useMutation({
    mutationFn: deleteWishlistItem,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<Product[]>(['wishlistItems'], (old) =>
        old?.filter((p) => p.id !== deletedId),
      )
      queryClient.invalidateQueries({ queryKey: ['wishlistItems'] })
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleAdd = (formData: WishFormData) => {
    addMutation.mutate(formData)
  }

  const extendMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: WishFormData }) =>
      updateWishlistItem(id, formData),
    onSuccess: patchWishlistItemCache,
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
    onSuccess: patchWishlistItemCache,
  })

  const handleEdit = (id: string, formData: WishFormData) => {
    editMutation.mutate({ id, formData })
  }

  const categoriesToRender: Category[] = filter === '전체' ? [...CATEGORIES] : [filter]

  const isUnauthorized =
    isUnauthorizedError(error) ||
    isUnauthorizedError(addMutation.error) ||
    isUnauthorizedError(editMutation.error) ||
    isUnauthorizedError(extendMutation.error) ||
    isUnauthorizedError(deleteMutation.error)

  // 삭제 401 에러 여부를 별도 노출 (상세 화면/재판단 화면에서 로그인 분기용)
  const isDeleteUnauthorized = isUnauthorizedError(deleteMutation.error)

  const editErrorKind = getMutationErrorKind(editMutation.error) // 'EMPTY' | 'FORBIDDEN' | 'NOT_FOUND' | null
  const deleteErrorKind = getMutationErrorKind(deleteMutation.error)

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
    editErrorKind,
    resetEditStatus: editMutation.reset,
    isExtending: extendMutation.isPending,
    isExtendSuccess: extendMutation.isSuccess,
    isExtendError: extendMutation.isError,
    resetExtendStatus: extendMutation.reset,
    isDeleting: deleteMutation.isPending,
    isDeleteSuccess: deleteMutation.isSuccess,
    isDeleteError: deleteMutation.isError,
    isDeleteUnauthorized,
    deleteErrorKind,
    resetDeleteStatus: deleteMutation.reset,
    isUnauthorized,
    handleDelete,
    handleAdd,
    handleExtend,
    handleEdit,
  }
}
