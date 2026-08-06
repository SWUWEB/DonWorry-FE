import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import TabGroup from '@/shared/components/TabGroup'
import AmountInput from '@/components/layout/AmountInput'
import CategorySelector from '@/components/layout/CategorySelector'
import type { Category } from '@/components/layout/CategorySelector'
import { CATEGORIES } from '@/constants/product'
import type { RecordType } from '@/features/record/mockRecords'
import styles from './RecordCreatePage.module.css'

const RECORD_TYPE_OPTIONS: { label: string; value: RecordType }[] = [
  { label: '참은 소비', value: 'saved' },
  { label: '소비', value: 'consume' },
]

export default function RecordCreatePage() {
  const navigate = useNavigate()
  const [type, setType] = useState<RecordType>('consume')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState<Category>(CATEGORIES[0])
  const [reason, setReason] = useState('')

  const isValid = title.trim() !== '' && amount > 0

  // 하드코딩됨. 실제 저장(API 연결) 로직은 추후 구현 예정. 지금은 타입에 따라 라우팅만 처리합니다.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValid) return

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
        subTitle="소비 기록 추가"
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>기록 유형</label>
          <TabGroup<RecordType>
            className={styles.chipGroup}
            options={RECORD_TYPE_OPTIONS}
            value={type}
            onChange={setType}
          />
        </div>

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
          기록하기
        </button>
      </form>
    </div>
  )
}
