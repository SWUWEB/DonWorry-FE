import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { IoTrashOutline } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import TabGroup from '@/shared/components/TabGroup'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import AmountInput from '@/components/layout/AmountInput'
import CategorySelector from '@/components/layout/CategorySelector'
import type { Category } from '@/components/layout/CategorySelector'
import { CATEGORIES } from '@/constants/product'
import type { RecordType } from '@/features/record/mockRecords'
import type { RecordDetail } from '@/features/record/api/consumptionRecordApi'
import {
  useConsumptionRecordDetail,
  useCreateConsumptionRecord,
  useUpdateConsumptionRecord,
  useDeleteConsumptionRecord,
} from '@/features/record/hooks/useConsumptionRecords'
import { useParseProductUrl } from '@/features/record/hooks/useProductUrl'
import styles from './RecordCreatePage.module.css'

const RECORD_TYPE_OPTIONS: { label: string; value: RecordType }[] = [
  { label: '참았어요', value: 'saved' },
  { label: '샀어요', value: 'consume' },
]

export interface RecordDraft {
  title: string
  amount: number
  category: Category
  reason: string
  productUrl?: string
}

export default function RecordCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  const {
    data: editingRecord,
    isLoading: isLoadingRecord,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useConsumptionRecordDetail(id)
  const isNotFound = isAxiosError(detailError) && detailError.response?.status === 404

  useEffect(() => {
    if (isNotFound) {
      navigate('/record', { replace: true })
    }
  }, [isNotFound, navigate])

  if (isEditMode && isNotFound) return null

  if (isEditMode && isLoadingRecord) {
    return <p className={styles.message}>불러오는 중...</p>
  }

  if (isEditMode && isDetailError) {
    return (
      <div className={styles.message}>
        <p>소비 기록을 불러오지 못했습니다.</p>
        <button type="button" className={styles.retryButton} onClick={() => refetchDetail()}>
          다시 시도
        </button>
      </div>
    )
  }

  // id별로, 그리고 상세 데이터가 준비된 이후에만 마운트되도록 route key를 컴포넌트 경계에 적용합니다.
  return <RecordCreateForm key={id ?? 'new'} id={id} editingRecord={editingRecord} />
}

function RecordCreateForm({ id, editingRecord }: { id?: string; editingRecord?: RecordDetail }) {
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const createRecord = useCreateConsumptionRecord()
  const updateRecord = useUpdateConsumptionRecord()
  const deleteRecord = useDeleteConsumptionRecord()
  const parseUrl = useParseProductUrl()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [type, setType] = useState<RecordType>(editingRecord?.type ?? 'consume')
  const [productUrl, setProductUrl] = useState('')
  const [title, setTitle] = useState(editingRecord?.title ?? '')
  const [amount, setAmount] = useState(editingRecord?.amount ?? 0)
  const [category, setCategory] = useState<Category>(
    (editingRecord?.category as Category) ?? CATEGORIES[0],
  )
  const [reason, setReason] = useState(editingRecord?.reason ?? '')

  const isValid = title.trim() !== '' && amount > 0

  const submitError = createRecord.isError || updateRecord.isError

  const handleParseUrl = () => {
    if (!productUrl.trim()) return
    parseUrl.mutate(productUrl, {
      onSuccess: (data) => {
        setTitle(data.productName)
        setAmount(data.price)
      },
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValid) return

    if (isEditMode && id) {
      updateRecord.mutate(
        { id, input: { type, productName: title, price: amount, category, reason, productUrl } },
        { onSuccess: () => navigate(`/record/${id}`) },
      )
      return
    }

    if (type === 'consume') {
      const draft: RecordDraft = { title, amount, category, reason, productUrl }
      navigate('/record/intervention', { state: { draft } })
      return
    }

    createRecord.mutate(
      { type, productName: title, price: amount, category, reason, productUrl },
      { onSuccess: () => navigate('/record') },
    )
  }

  const handleDelete = () => {
    if (!id) return
    deleteRecord.mutate(id, { onSuccess: () => navigate('/record', { replace: true }) })
  }

  return (
    <div className={styles.container}>
      <Header
        subLeft={<HeaderBackButton />}
        subTitle={isEditMode ? '소비 기록 수정' : '소비 기록 입력'}
        subRight={
          isEditMode ? (
            <button type="button" aria-label="삭제" onClick={() => setIsDeleteDialogOpen(true)}>
              <IoTrashOutline size={20} />
            </button>
          ) : undefined
        }
        subMain={
          <TabGroup<RecordType>
            variant="segment"
            options={RECORD_TYPE_OPTIONS}
            value={type}
            onChange={setType}
          />
        }
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="productUrl" className={styles.label}>
            상품 URL (선택)
          </label>
          <div className={styles.urlRow}>
            <input
              id="productUrl"
              className={`${styles.textInput} ${styles.urlInput}`}
              placeholder="https://..."
              value={productUrl}
              onChange={(event) => setProductUrl(event.target.value)}
            />
            <button
              type="button"
              className={styles.urlButton}
              disabled={!productUrl.trim() || parseUrl.isPending}
              onClick={handleParseUrl}
            >
              {parseUrl.isPending ? '불러오는 중' : '불러오기'}
            </button>
          </div>
          {parseUrl.isError && <p className={styles.errorText}>URL을 불러오는 데 실패했습니다.</p>}
          {parseUrl.isSuccess && <p className={styles.successText}>상품 정보를 불러왔습니다.</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="amount" className={styles.label}>
            금액
          </label>
          <AmountInput
            id="amount"
            className={styles.amountWrapper}
            value={amount}
            onChange={setAmount}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            상품명
          </label>
          <input
            id="title"
            className={styles.textInput}
            placeholder="예: 투썸플레이스 신봉점"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>카테고리</label>
          <CategorySelector value={category} onChange={setCategory} />
        </div>

        <div className={styles.field}>
          <label htmlFor="reason" className={styles.label}>
            사고 싶은 이유 (선택)
          </label>
          <input
            id="reason"
            className={styles.textInput}
            placeholder="스트레스 받아서? 진짜 필요해서?"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>

        {submitError && <p className={styles.errorText}>저장에 실패했습니다. 다시 시도해주세요.</p>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!isValid || createRecord.isPending || updateRecord.isPending}
        >
          {isEditMode ? '수정하기' : '기록하기'}
        </button>
      </form>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="이 소비 기록을 삭제할까요?"
        description="삭제한 기록은 복구할 수 없습니다."
        confirmText="삭제"
        isLoading={deleteRecord.isPending}
        errorMessage={deleteRecord.isError ? '삭제에 실패했습니다. 다시 시도해주세요.' : undefined}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
