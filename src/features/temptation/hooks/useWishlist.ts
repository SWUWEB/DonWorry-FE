import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product'
import type { Category, FilterValue, SortValue, Product } from '../types'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'
import { fetchWishlistItems, addWishlistItem } from '../api/wishlistApi'
import { isUnauthorizedError } from '../utils/isUnauthorizedError'

const TIME_TO_HOURS: Record<(typeof TIME_OPTIONS)[number], number> = {
  '1시간': 1,
  '1일': 24,
  '3일': 72,
  '7일': 168,
}

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

  // 수정/삭제 등 연동 전 API에 대한 임시 방편
  // 연동 후 해당 부분 삭제, serverProducts를 직접 사용하도록 변경
  const [localOverrides, setLocalOverrides] = useState<{
    deletedIds: Set<string>
    edited: Map<string, Product>
  }>({ deletedIds: new Set(), edited: new Map() })

  const products = useMemo(() => {
    return serverProducts
      .filter((p) => !localOverrides.deletedIds.has(p.id))
      .map((p) => localOverrides.edited.get(p.id) ?? p)
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
    console.warn(`API 연동 전! (id: ${id}) 다다음 이슈에서 작업 예정`)
    setLocalOverrides((prev) => ({
      ...prev,
      deletedIds: new Set(prev.deletedIds).add(id),
    }))
  }

  const handleAdd = (formData: WishFormData) => {
    addMutation.mutate(formData)
  }

  const handleExtend = (id: string, timeOption: (typeof TIME_OPTIONS)[number]) => {
    console.warn(`API 연동 전! (id: ${id}, timeOption: ${timeOption})`)
    const target = products.find((p) => p.id === id)
    if (!target) return

    const updated: Product = {
      ...target,
      // 연장 시점을 새 기준으로 삼아 남은 시간 게이지와 수정 화면이 함께 맞도록
      // time/timeOption/createdAt을 모두 갱신
      time: new Date(Date.now() + TIME_TO_HOURS[timeOption] * 60 * 60 * 1000),
      timeOption,
      createdAt: new Date(),
    }

    setLocalOverrides((prev) => ({
      ...prev,
      edited: new Map(prev.edited).set(id, updated),
    }))
  }

  const handleEdit = (id: string, formData: WishFormData, timeChanged: boolean) => {
    console.warn(
      `API 연동 전! (id: ${id}, formData: ${JSON.stringify(formData)}, timeChanged: ${timeChanged})`,
    )
    const target = products.find((p) => p.id === id)
    if (!target) return

    const newTime = timeChanged
      ? // 남은 고민 시간 수정 로직
        new Date(Date.now() + TIME_TO_HOURS[formData.time] * 60 * 60 * 1000)
      : target.time

    const updated: Product = {
      ...target,
      name: formData.name,
      price: formData.price,
      time: newTime,
      timeOption: formData.time,
      category: formData.category,
      link: formData.link,
      reason: formData.reason,
    }

    setLocalOverrides((prev) => ({
      ...prev,
      edited: new Map(prev.edited).set(id, updated),
    }))
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
    handleExtend,
    handleEdit,
  }
}
