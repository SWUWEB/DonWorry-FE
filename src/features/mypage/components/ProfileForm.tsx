import { useState } from 'react'
import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
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
        <InputField
          label="이름"
          placeholder="이름을 입력해주세요."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="전화번호"
          placeholder="- 없이 입력해주세요."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="생년월일"
          placeholder="생년월일을 선택해주세요."
          value={birth}
          onChange={() => {}}
          readOnly
          rightElement={<HiOutlineCalendarDays className={styles.calendarIcon} />}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>성별</label>

        <div className={styles.genderGroup}>
          <label className={styles.genderItem}>
            <input
              id="female"
              name="gender"
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
              name="gender"
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
        <Button>
          저장하기
        </Button>
      </div>
    </section>
  )
}
