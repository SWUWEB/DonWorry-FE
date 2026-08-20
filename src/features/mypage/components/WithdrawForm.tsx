import { useState } from 'react'
import type { FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { IoWarningOutline, IoChevronDown } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import Button from '@/shared/components/Button'
import InputField from '@/shared/components/InputField'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useDeleteMe } from '../hooks/useUser'
import type { WithdrawReasonType } from '../api/userApi'
import styles from './WithdrawForm.module.css'

const REASON_OPTIONS: { value: WithdrawReasonType; label: string }[] = [
  { value: 'LOW_FREQUENCY', label: '사용 빈도가 낮아요' },
  { value: 'INCONVENIENT', label: '서비스 이용이 불편해요' },
  { value: 'PRIVACY_CONCERN', label: '개인정보가 걱정돼요' },
  { value: 'MISSING_FEATURE', label: '필요한 기능이 없어요' },
  { value: 'SWITCHING_SERVICE', label: '다른 서비스를 이용하려고요' },
  { value: 'OTHER', label: '기타' },
]

export default function WithdrawForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: deleteMe, isPending } = useDeleteMe()

  const [reason, setReason] = useState<WithdrawReasonType | ''>('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    setError('')
    setIsConfirmOpen(true)
  }

  const handleConfirmWithdraw = () => {
    deleteMe(
      { password, reasonType: reason || undefined },
      {
        onSuccess: () => {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          queryClient.clear()
          navigate('/login', { replace: true })
        },
        onError: (err) => {
          setIsConfirmOpen(false)

          const status = isAxiosError(err) ? err.response?.status : undefined
          setError(
            status === 400
              ? '비밀번호가 올바르지 않습니다.'
              : '탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.',
          )
        },
      },
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.warningBox}>
        <div className={styles.warningHeader}>
          <IoWarningOutline size={20} className={styles.warningIcon} />

          <span className={styles.warningTitle}>탈퇴 시 유의사항</span>
        </div>

        <ul className={styles.warningList}>
          <li>모든 데이터가 삭제되어 복구할 수 없습니다.</li>

          <li>탈퇴 후 재가입이 불가능합니다.</li>

          <li>이전 데이터는 복구되지 않습니다.</li>
        </ul>
      </section>

      {/* 탈퇴 사유 */}
      <div className={styles.inputGroup}>
        <label htmlFor="reason" className={styles.label}>
          탈퇴 사유
          <span className={styles.optional}>(선택)</span>
        </label>

        <div className={styles.selectWrapper}>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as WithdrawReasonType)}
            className={`${styles.select} ${reason === '' ? styles.placeholder : ''}`}
          >
            <option value="" disabled>
              사유를 선택 해주세요
            </option>

            {REASON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <IoChevronDown size={18} className={styles.selectIcon} />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="비밀번호 확인"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          error={error}
        />
      </div>

      <button type="submit" className={styles.withdrawButton}>
        탈퇴하기
      </button>

      <Button
        type="button"
        variant="outline"
        className={styles.cancelButton}
        onClick={() => navigate(-1)}
      >
        취소
      </Button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴한 계정은 복구할 수 없습니다."
        confirmText="탈퇴"
        isLoading={isPending}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmWithdraw}
      />
    </form>
  )
}
