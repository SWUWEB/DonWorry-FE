import { useMemo, useState } from 'react'
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product'
import type { Category, Product, FilterValue, SortValue } from '../types'
import { MOCK_PRODUCTS } from '../mockData'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'

const TIME_TO_HOURS: Record<(typeof TIME_OPTIONS)[number], number> = {
  '1시간': 1,
  '1일': 24,
  '3일': 72,
  '7일': 168,
}

const timeStringToDate = (time: (typeof TIME_OPTIONS)[number]): Date => {
  const hours = TIME_TO_HOURS[time]
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

export const useWishlist = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
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

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleAdd = (formData: WishFormData) => {
    const newProduct: Product = {
      id: globalThis.crypto?.randomUUID?.() ?? Date.now().toString(), // 백엔드 연동 시 발급받은 고유 id 할당
      name: formData.name,
      price: formData.price,
      time: timeStringToDate(formData.time),
      timeOption: formData.time,
      category: formData.category,
      link: formData.link,
      reason: formData.reason,
      createdAt: new Date(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const handleExtend = (id: string, timeOption: typeof TIME_OPTIONS[number]) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, time: new Date(Date.now() + TIME_TO_HOURS[timeOption] * 60 * 60 * 1000) }
          : p
      )
    )
  };

  const handleEdit = (id: string, formData: WishFormData, timeChanged: boolean) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p

        // 남은 고민 시간 수정 로직
        const newTime = timeChanged
          ? new Date(Date.now() + TIME_TO_HOURS[formData.time] * 60 * 60 * 1000)
          : p.time

        return {
          ...p,
          name: formData.name,
          price: formData.price,
          time: newTime,
          timeOption: formData.time,
          category: formData.category,
          link: formData.link,
          reason: formData.reason,
        }
      }),
    )
  }

  const categoriesToRender: Category[] = filter === '전체' ? [...CATEGORIES] : [filter]

  return {
    keyword,
    setKeyword,
    filter,
    setFilter,
    sort,
    setSort,
    filteredProducts,
    categoriesToRender,
    handleDelete,
    handleAdd,
    handleExtend,
    handleEdit,
  }
}
