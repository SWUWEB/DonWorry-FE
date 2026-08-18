import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import { useMe, useUpdateMe } from '../hooks/useUser'

import styles from './ProfileForm.module.css'

type Gender = 'female' | 'male'

const GENDER_TO_API: Record<Gender, 'FEMALE' | 'MALE'> = {
  female: 'FEMALE',
  male: 'MALE',
}

const GENDER_FROM_API: Record<'FEMALE' | 'MALE', Gender> = {
  FEMALE: 'female',
  MALE: 'male',
}

export default function ProfileForm() {
  const { data: profile } = useMe()
  const { mutate: updateMe, isPending } = useUpdateMe()

  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState<Gender>('female')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      // 서버에서 불러온 값을 편집 가능한 로컬 상태로 최초 1회 반영합니다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNickname(profile.nickname)
      setPhone(profile.phoneNumber ?? '')
      setBirth(profile.birthDate ?? '')
      setGender(profile.gender ? GENDER_FROM_API[profile.gender] : 'female')
    }
  }, [profile])

  const handleSubmit = () => {
    if (!nickname.trim()) {
      setError('이름을 입력해주세요.')
      return
    }

    setError('')
    setSaved(false)

    updateMe(
      {
        nickname,
        phoneNumber: phone || null,
        birthDate: birth || null,
        gender: GENDER_TO_API[gender],
      },
      {
        onSuccess: () => setSaved(true),
        onError: (err) => {
          const fieldError = isAxiosError(err)
            ? Object.values(
                (err.response?.data as { errors?: { fieldErrors?: Record<string, string[]> } })
                  ?.errors?.fieldErrors ?? {},
              )
                .flat()
                .find(Boolean)
            : undefined

          setError(fieldError ?? '저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
        },
      },
    )
  }

  return (
    <section className={styles.form}>
      <div className={styles.inputGroup}>
        <InputField
          label="이름"
          placeholder="이름을 입력해주세요."
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            setError('')
            setSaved(false)
          }}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="전화번호"
          placeholder="- 없이 입력해주세요."
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setError('')
            setSaved(false)
          }}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="생년월일"
          type="date"
          value={birth}
          onChange={(e) => {
            setBirth(e.target.value)
            setError('')
            setSaved(false)
          }}
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
              onChange={() => {
                setGender('female')
                setError('')
                setSaved(false)
              }}
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
              onChange={() => {
                setGender('male')
                setError('')
                setSaved(false)
              }}
            />
            남성
          </label>
        </div>
      </div>

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}
      {saved && <p className={styles.formSuccess}>저장되었습니다.</p>}

      <div className={styles.buttonWrapper}>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? '저장 중...' : '저장하기'}
        </Button>
      </div>
    </section>
  )
}
