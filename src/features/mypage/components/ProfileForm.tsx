import { useState } from 'react'
import PrimaryButton from '@/features/auth/components/PrimaryButton'
import { HiOutlineCalendarDays } from 'react-icons/hi2';

import styles from './ProfileForm.module.css'

export default function ProfileForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birth] = useState('')
  const [gender, setGender] = useState('female')

  return (
    <section className={styles.form}>
      <div className={styles.inputGroup}>

        <label htmlFor="name" className={styles.label}>이름</label>

        <input
          id="name"
          className={styles.input}
          placeholder="이름을 입력해주세요."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone" className={styles.label}>전화번호</label>

        <input
          id="phone"
          className={styles.input}
          placeholder="- 없이 입력해주세요."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="birth" className={styles.label}>생년월일</label>

        <div className={styles.dateInput}>
          <input
            id="birth"
            className={styles.input}
            type="text"
            placeholder="생년월일을 선택해주세요."
            value={birth}
            readOnly
          />

    <HiOutlineCalendarDays className={styles.calendarIcon} />
  </div>
</div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>성별</label>

        <div className={styles.genderGroup}>
          <label className={styles.genderItem}>
            <input
              id="female"
              type="radio"
              value="female"
              checked={gender === 'female'}
              onChange={(e) => setGender(e.target.value)}
            />
            여성
          </label>

          <label className={styles.genderItem}>
            <input
              id="male"
              type="radio"
              value="male"
              checked={gender === 'male'}
              onChange={(e) => setGender(e.target.value)}
            />
            남성
          </label>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <PrimaryButton>
          저장하기
        </PrimaryButton>
      </div>
    </section>
  )
}