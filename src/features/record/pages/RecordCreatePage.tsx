import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChevronBack } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import FilterChip from '@/features/record/components/FilterChip'
import { CATEGORIES } from '@/constants/product'
import type { RecordType } from '@/features/record/components/RecordCard'
import styles from './RecordCreatePage.module.css'

export default function RecordCreatePage() {
  const navigate = useNavigate()
  const [type, setType] = useState<RecordType>('consume')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState<string>(CATEGORIES[0])
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
        left={
          <button type="button" aria-label="로고">
            Logo
          </button>
        }
        subLeft={
          <button type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}>
            <IoChevronBack size={20} />
          </button>
        }
        subTitle="소비 기록 추가"
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>기록 유형</label>
          <div className={styles.chipGroup}>
            <FilterChip
              label="참은 소비"
              selected={type === 'saved'}
              onClick={() => setType('saved')}
            />
            <FilterChip
              label="소비"
              selected={type === 'consume'}
              onClick={() => setType('consume')}
            />
          </div>
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
          <div className={styles.amountWrapper}>
            <input
              id="amount"
              className={styles.amountInput}
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount === 0 ? '' : amount.toLocaleString('ko-KR')}
              onChange={(event) => {
                const raw = event.target.value.replace(/[^0-9]/g, '')
                setAmount(raw === '' ? 0 : Number(raw))
              }}
            />
            <span className={styles.currency}>원</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>카테고리</label>
          <div className={styles.chipGroup}>
            {CATEGORIES.map((item) => (
              <FilterChip
                key={item}
                label={item}
                selected={category === item}
                onClick={() => setCategory(item)}
              />
            ))}
          </div>
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
