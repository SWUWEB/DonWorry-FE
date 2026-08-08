import { useEffect, useRef, useState } from 'react'
import styles from './ProductForm.module.css'
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import AmountInput from './AmountInput'
import CategorySelector from './CategorySelector'

export interface FormData {
  link?: string
  price: number
  name: string
  category: (typeof CATEGORIES)[number]
  time: (typeof TIME_OPTIONS)[number]
  reason: string
}

interface FormProps {
  formId?: string
  showTimeSelector?: boolean
  initialData?: Partial<FormData>
  onSubmit: (data: FormData, meta: { timeChanged: boolean }) => void
  onDirtyChange?: (isDirty: boolean) => void
}

const DEFAULT_FORM_DATA: FormData = {
  link: '',
  price: 0,
  name: '',
  category: '패션',
  time: '1일',
  reason: '',
}

const NAME_MAX_LENGTH = 50
const REASON_MAX_LENGTH = 100
const URL_PATTERN = /^https?:\/\/.+/i

export function ProductForm({
  formId = 'product-form',
  showTimeSelector = true,
  initialData,
  onSubmit,
  onDirtyChange,
}: FormProps) {
  const mergedInitial: FormData = {
    link: initialData?.link ?? DEFAULT_FORM_DATA.link,
    price: initialData?.price ?? DEFAULT_FORM_DATA.price,
    name: initialData?.name ?? DEFAULT_FORM_DATA.name,
    category: initialData?.category ?? DEFAULT_FORM_DATA.category,
    time: initialData?.time ?? DEFAULT_FORM_DATA.time,
    reason: initialData?.reason ?? DEFAULT_FORM_DATA.reason,
  }

  const initialSnapshotRef = useRef<FormData>(mergedInitial)
  const [data, setData] = useState<FormData>(mergedInitial)

  const [linkStatus, setLinkStatus] = useState<{
    loading: boolean
    error: boolean
    success?: boolean
  }>({ loading: false, error: false, success: false })

  const [urlFormatError, setUrlFormatError] = useState(false)
  const [pendingFetchResult, setPendingFetchResult] = useState<{
    name: string
    price: number
  } | null>(null)
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false)

  useEffect(() => {
    const isDirty = JSON.stringify(data) !== JSON.stringify(initialSnapshotRef.current)
    onDirtyChange?.(isDirty)
  }, [data, onDirtyChange])

  const isValidUrl = (value: string) => URL_PATTERN.test(value.trim())

  const applyFetchedResult = (result: { name: string; price: number }) => {
    setData((prev) => ({ ...prev, name: result.name, price: result.price }))
    setLinkStatus({ loading: false, error: false, success: true })
  }

  const handleLinkFetch = async () => {
    const trimmedLink = data.link?.trim() ?? ''
    if (!trimmedLink || !isValidUrl(trimmedLink)) {
      setUrlFormatError(true)
      return
    }
    setLinkStatus({ loading: true, error: false, success: false })

    try {
      const result = await fetchProductData(trimmedLink)
      const hasExistingInput = data.name.trim() !== '' || data.price > 0
      if (hasExistingInput) {
        setPendingFetchResult(result)
        setShowOverwriteConfirm(true)
        setLinkStatus({ loading: false, error: false, success: false })
      } else {
        applyFetchedResult(result)
      }
    } catch {
      setLinkStatus({ loading: false, error: true, success: false })
    }
  }

  const handleOverwriteConfirm = () => {
    if (pendingFetchResult) {
      applyFetchedResult(pendingFetchResult)
    }
    setPendingFetchResult(null)
    setShowOverwriteConfirm(false)
  }

  const handleOverwriteCancel = () => {
    setPendingFetchResult(null)
    setShowOverwriteConfirm(false)
    setLinkStatus({ loading: false, error: false, success: false })
  }

  const [touched, setTouched] = useState({ price: false, name: false })
  const handleBlur = (field: 'price' | 'name') => setTouched({ ...touched, [field]: true })

  const priceError = touched.price && data.price === 0
  const nameEmptyError = touched.name && data.name.trim() === ''
  const nameLengthError = data.name.length > NAME_MAX_LENGTH
  const reasonLengthError = data.reason.length > REASON_MAX_LENGTH

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isPriceEmpty = data.price === 0
    const isNameEmpty = data.name.trim() === ''
    const isNameTooLong = data.name.length > NAME_MAX_LENGTH
    const isReasonTooLong = data.reason.length > REASON_MAX_LENGTH

    if (isPriceEmpty || isNameEmpty || isNameTooLong || isReasonTooLong) {
      setTouched({ price: true, name: true })
      return
    }

    const timeChanged = data.time !== initialSnapshotRef.current.time
    onSubmit(data, { timeChanged })
  }

  return (
    <>
      <form id={formId} className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="link" className={styles.label}>
            상품 링크 (선택)
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="link"
              className={styles.textInput}
              placeholder="https://..."
              value={data.link}
              onChange={(e) => {
                setData({ ...data, link: e.target.value })
                setUrlFormatError(false)
                if (linkStatus.error || linkStatus.success) {
                  setLinkStatus({ loading: false, error: false, success: false })
                }
              }}
            />
            <button
              type="button"
              className={styles.button}
              disabled={linkStatus.loading || !data.link?.trim() || !isValidUrl(data.link ?? '')}
              onClick={handleLinkFetch}
            >
              {linkStatus.loading ? '• • •' : '불러오기'}
            </button>
          </div>
          {urlFormatError && (
            <p className={`${styles.message} ${styles.errorMessage}`}>
              올바른 상품 URL을 입력해주세요.
            </p>
          )}
          {linkStatus.error && (
            <p className={`${styles.message} ${styles.errorMessage}`}>
              URL을 불러오는 데 실패했습니다.
            </p>
          )}
          {linkStatus.success && (
            <p className={`${styles.message} ${styles.successMessage}`}>
              상품 정보를 불러왔습니다.
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="price" className={styles.label}>
            상품 가격
          </label>
          <AmountInput
            id="price"
            className={styles.priceWrapper}
            value={data.price}
            onChange={(price) => setData({ ...data, price })}
            onBlur={() => handleBlur('price')}
          />
          {priceError && (
            <p className={`${styles.message} ${styles.errorMessage}`}>상품 가격을 입력해주세요.</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            상품명
          </label>
          <input
            id="name"
            className={styles.textInput}
            placeholder="상품명을 입력해주세요."
            value={data.name}
            onBlur={() => handleBlur('name')}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          {nameEmptyError && (
            <p className={`${styles.message} ${styles.errorMessage}`}>상품명을 입력해주세요.</p>
          )}
          {!nameEmptyError && nameLengthError && (
            <p className={`${styles.message} ${styles.errorMessage}`}>
              상품명은 {NAME_MAX_LENGTH}자 이내로 입력해주세요. ({data.name.length}/
              {NAME_MAX_LENGTH})
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>카테고리</label>
          <CategorySelector
            value={data.category}
            onChange={(category) => setData({ ...data, category })}
          />
        </div>

        {showTimeSelector && (
          <div className={styles.field}>
            <label className={styles.label}>고민해볼 시간</label>
            <div className={styles.chipGroup} role="radiogroup">
              {TIME_OPTIONS.map((t) => (
                <label
                  key={t}
                  className={`${styles.chip} ${data.time === t ? styles.chipSelected : ''}`}
                >
                  <input
                    type="radio"
                    name="time"
                    value={t}
                    className={styles.hidden}
                    checked={data.time === t}
                    onChange={() => setData({ ...data, time: t })}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="reason" className={styles.label}>
            사고 싶은 이유 (선택)
          </label>
          <textarea
            id="reason"
            className={styles.textInput}
            placeholder="사고 싶은 이유를 입력해주세요."
            value={data.reason}
            onChange={(e) => setData({ ...data, reason: e.target.value })}
            rows={3}
          />
          {reasonLengthError && (
            <p className={`${styles.message} ${styles.errorMessage}`}>
              사고 싶은 이유는 {REASON_MAX_LENGTH}자 이내로 입력해주세요. ({data.reason.length}/
              {REASON_MAX_LENGTH})
            </p>
          )}
        </div>
      </form>

      <ConfirmDialog
        isOpen={showOverwriteConfirm}
        title="기존 상품명과 가격을 불러온 정보로 변경할까요?"
        cancelText="취소하기"
        confirmText="변경하기"
        onCancel={handleOverwriteCancel}
        onConfirm={handleOverwriteConfirm}
      />
    </>
  )
}

async function fetchProductData(link: string): Promise<{ name: string; price: number }> {
  console.log('fetchProductData called with link:', link)
  throw new Error('Not implemented')
}
