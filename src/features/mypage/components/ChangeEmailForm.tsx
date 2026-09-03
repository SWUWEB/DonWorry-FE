import { HiOutlineCheckCircle } from 'react-icons/hi2'

import Button from '@/shared/components/Button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { isUnauthorizedError } from '@/shared/utils/isUnauthorizedError'
import { useMe } from '../hooks/useUser'

import styles from './ChangeEmailForm.module.css'

interface ChangeEmailFormProps {
  onUnauthorized?: () => void
}

// TODO(BE 연동): OpenAPI에 이메일 변경·인증 endpoint가 추가되면 변경 폼과 mutation을 연결합니다.
// 현재는 GET /users/me의 실제 이메일만 표시하고 변경 동작은 비활성화합니다.
export default function ChangeEmailForm({ onUnauthorized = () => {} }: ChangeEmailFormProps) {
  const { data: profile, isLoading, isError, error, refetch } = useMe()
  const isUnauthorized = isUnauthorizedError(error)

  return (
    <>
      <section className={styles.form}>
        <div className={styles.currentEmailCard}>
          <div>
            <p className={styles.cardLabel}>현재 이메일</p>
            <p className={styles.currentEmail}>
              {isLoading ? '불러오는 중...' : (profile?.email ?? '확인할 수 없음')}
            </p>
          </div>

          {profile?.email && <HiOutlineCheckCircle size={20} className={styles.checkIcon} />}
        </div>

        {isError && !isUnauthorized && (
          <div className={styles.errorRow}>
            <p className={styles.errorText} role="alert">
              현재 이메일을 불러오지 못했습니다.
            </p>
            <button type="button" className={styles.retryButton} onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        )}

        <div className={styles.noticeBox}>
          <p className={styles.unsupportedText}>
            현재 서버에서 이메일 변경 기능을 지원하지 않습니다. API가 제공되면 변경과 인증 기능을
            연결할 예정입니다.
          </p>
        </div>

        <div className={styles.buttonWrapper}>
          <Button disabled>이메일 변경 준비 중</Button>
        </div>
      </section>

      <ConfirmDialog
        isOpen={isUnauthorized}
        title="로그인이 필요합니다."
        description="로그인 후 다시 이용해주세요."
        confirmText="로그인하기"
        onlyConfirm
        onCancel={onUnauthorized}
        onConfirm={onUnauthorized}
      />
    </>
  )
}
