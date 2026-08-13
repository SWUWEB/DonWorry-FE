import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import TabGroup from '@/shared/components/TabGroup'
import AmountInput from '@/components/layout/AmountInput'
import CategorySelector from '@/components/layout/CategorySelector'
import type { Category } from '@/components/layout/CategorySelector'
import { CATEGORIES } from '@/constants/product'
import { MOCK_RECORDS } from '@/features/record/mockRecords'
import type { RecordType } from '@/features/record/mockRecords'
import styles from './RecordCreatePage.module.css'

const RECORD_TYPE_OPTIONS: { label: string; value: RecordType }[] = [
  { label: '참았어요', value: 'saved' },
  { label: '샀어요', value: 'consume' },
]

export default function RecordCreatePage() {
  const { id } = useParams<{ id: string }>()

  // id별로 폼 상태를 새로 초기화하기 위해 route key를 컴포넌트 경계에 적용합니다.
  return <RecordCreateForm key={id ?? 'new'} id={id} />
}

function RecordCreateForm({ id }: { id?: string }) {
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const editingRecord = id ? MOCK_RECORDS.find((item) => item.id === id) : undefined

  useEffect(() => {
    if (isEditMode && !editingRecord) {
      navigate('/record', { replace: true })
    }
  }, [isEditMode, editingRecord, navigate])

  const [type, setType] = useState<RecordType>(editingRecord?.type ?? 'consume')
  const [title, setTitle] = useState(editingRecord?.title ?? '')
  const [amount, setAmount] = useState(editingRecord?.amount ?? 0)
  const [category, setCategory] = useState<Category>(
    (editingRecord?.category as Category) ?? CATEGORIES[0],
  )
  const [reason, setReason] = useState(editingRecord?.reason ?? '')

  const isValid = title.trim() !== '' && amount > 0

  if (isEditMode && !editingRecord) return null

  // 하드코딩됨. 실제 저장(API 연결) 로직은 추후 구현 예정. 지금은 타입에 따라 라우팅만 처리합니다.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValid) return

    if (isEditMode) {
      navigate(`/record/${id}`)
      return
    }

    if (type === 'consume') {
      navigate('/record/intervention')
      return
    }

    navigate('/record')
  }

  return (
    <div className={styles.container}>
      <Header
        subLeft={<HeaderBackButton />}
        subTitle={isEditMode ? '소비 기록 수정' : '소비 기록 입력'}
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
          <label htmlFor="title" className={styles.label}>
            이름
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

        <button type="submit" className={styles.submitBtn} disabled={!isValid}>
          {isEditMode ? '수정하기' : '기록하기'}
        </button>
      </form>
    </div>
  )
}
