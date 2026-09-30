import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { HiOutlineCalendarDays } from 'react-icons/hi2'
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

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const prefixLength = digits.startsWith('02') ? 2 : 3
  if (digits.length <= prefixLength) return digits
  if (digits.length <= prefixLength + 4) {
    return `${digits.slice(0, prefixLength)}-${digits.slice(prefixLength)}`
  }
  return `${digits.slice(0, prefixLength)}-${digits.slice(prefixLength, -4)}-${digits.slice(-4)}`
}

export default function ProfileForm() {
  const { data: profile, isLoading, isError, refetch } = useMe()
  const { mutate: updateMe, isPending } = useUpdateMe()

  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState<Gender | null>(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      // 서버에서 불러온 값을 편집 가능한 로컬 상태로 최초 1회 반영합니다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNickname(profile.nickname)
      setPhone(formatPhone(profile.phoneNumber ?? ''))
      setBirth(profile.birthDate ?? '')
      setGender(profile.gender ? GENDER_FROM_API[profile.gender] : null)
    }
  }, [profile])

  if (isLoading) {
    return <p className={styles.status}>회원 정보를 불러오는 중...</p>
  }

  if (isError || !profile) {
    return (
      <section className={styles.status}>
        <p role="alert">회원 정보를 불러오지 못했습니다.</p>
        <Button variant="outline" onClick={() => refetch()}>
          다시 시도
        </Button>
      </section>
    )
  }

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
        phoneNumber: phone.replace(/\D/g, '') || null,
        birthDate: birth || null,
        ...(gender && { gender: GENDER_TO_API[gender] }),
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
          placeholder="전화번호를 입력해주세요."
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          readOnly={isPending}
          value={phone}
          onChange={(e) => {
            const input = e.currentTarget
            const digitsBeforeCaret = input.value
              .slice(0, input.selectionStart ?? input.value.length)
              .replace(/\D/g, '').length
            const formatted = formatPhone(input.value)
            setPhone(formatted)
            // 자동 삽입된 하이픈 때문에 중간 편집 시 커서가 끝으로 이동하지 않게 합니다.
            let caret = 0
            let digitCount = 0
            while (caret < formatted.length && digitCount < digitsBeforeCaret) {
              if (/\d/.test(formatted[caret])) digitCount += 1
              caret += 1
            }
            requestAnimationFrame(() => {
              if (document.activeElement === input) input.setSelectionRange(caret, caret)
            })
            setError('')
            setSaved(false)
          }}
        />
      </div>

      <div
        className={`${styles.inputGroup} ${styles.birthField}`}
        onClick={(event) => {
          if (event.target instanceof HTMLInputElement) {
            try {
              event.target.showPicker?.()
            } catch {
              // showPicker를 지원하지 않는 환경에서는 기본 날짜 선택 동작을 유지합니다.
            }
          }
        }}
      >
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
        <span
          className={`${styles.birthDisplay} ${!birth ? styles.birthPlaceholder : ''}`}
          aria-hidden="true"
        >
          <span>{birth ? birth.replaceAll('-', '.') : '생년월일을 선택해주세요.'}</span>
          <HiOutlineCalendarDays size={18} />
        </span>
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
