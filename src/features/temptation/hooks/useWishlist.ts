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
  submitTemptationDecision,
  WAIT_TYPE_MAP,
  TIME_TO_WAIT_TYPE_MAP,
  type TemptationDecisionType,
} from '../api/wishlistApi'
import { isUnauthorizedError } from '../utils/isUnauthorizedError'
import { getMutationErrorKind } from '../utils/wishlistErrors'

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

  // 결정(구매/포기)이 끝난 항목은 서버가 목록에서 걸러주기 전까지 화면에서 즉시 감춥니다.
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

  // 목록 캐시를 서버 재조회 없이 즉시 갱신합니다.
  // invalidateQueries만 쓰면 재조회가 끝나기 전까지 목록에 남은 이전 값(예: 지난 고민 시간)을
  // 상세/재판단 화면이 그대로 읽어 서로를 오가며 화면이 튀는 문제가 있었습니다.
  const patchWishlistItemCache = (updated: Product) => {
    queryClient.setQueryData<Product[]>(['wishlistItems'], (old) =>
      old?.map((p) => (p.id === updated.id ? updated : p)),
    )
    queryClient.invalidateQueries({ queryKey: ['wishlistItems'] })
  }

  // 목록에서 즉시 제거합니다(삭제, 구매/포기 결정 완료 등 항목이 더 이상 유효하지 않을 때 공통으로 사용).
  const removeFromListCache = (id: string) => {
    setLocalOverrides((prev) => ({
      deletedIds: new Set(prev.deletedIds).add(id),
    }))
    queryClient.invalidateQueries({ queryKey: ['wishlistItems'] })
  }

  const handleAdd = (formData: WishFormData) => {
    addMutation.mutate(formData)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteWishlistItem,
    onSuccess: (_data, id) => {
      removeFromListCache(id)
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  // 고민 시간 연장: 재판단(decisions) API의 DELAY로 기록합니다.
  const extendMutation = useMutation({
    mutationFn: ({ id, timeOption }: { id: string; timeOption: (typeof TIME_OPTIONS)[number] }) =>
      submitTemptationDecision(id, 'DELAY', TIME_TO_WAIT_TYPE_MAP[timeOption]),
  })

  const handleExtend = (id: string, timeOption: (typeof TIME_OPTIONS)[number]) => {
    const target = products.find((p) => p.id === id)
    if (!target) return

    extendMutation.mutate(
      { id, timeOption },
      {
        onSuccess: (result) => {
          patchWishlistItemCache({
            ...target,
            time: result.selectedWaitUntil ? new Date(result.selectedWaitUntil) : target.time,
            timeOption: result.selectedWaitType
              ? (WAIT_TYPE_MAP[result.selectedWaitType] ?? timeOption)
              : timeOption,
          })
        },
      },
    )
  }

  // 재판단 화면의 구매/포기 결정: 성공 시 더 이상 대기 중이 아니므로 목록에서 제거합니다.
  const decisionMutation = useMutation({
    mutationFn: ({ id, decisionType }: { id: string; decisionType: TemptationDecisionType }) =>
      submitTemptationDecision(id, decisionType),
  })

  const handleJudgeDecision = (id: string, decisionType: 'BUY' | 'SKIP') => {
    decisionMutation.mutate({ id, decisionType }, { onSuccess: () => removeFromListCache(id) })
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
    isUnauthorizedError(deleteMutation.error) ||
    isUnauthorizedError(decisionMutation.error)

  const editErrorKind = getMutationErrorKind(editMutation.error) // 'EMPTY' | 'FORBIDDEN' | 'NOT_FOUND' | null
  const deleteErrorKind = getMutationErrorKind(deleteMutation.error)
  const decideErrorKind = getMutationErrorKind(decisionMutation.error)

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
    deleteErrorKind,
    resetDeleteStatus: deleteMutation.reset,
    isDeciding: decisionMutation.isPending,
    isDecideSuccess: decisionMutation.isSuccess,
    isDecideError: decisionMutation.isError,
    decideErrorKind,
    resetDecideStatus: decisionMutation.reset,
    isUnauthorized,
    handleDelete,
    handleAdd,
    handleExtend,
    handleEdit,
    handleJudgeDecision,
  }
}
