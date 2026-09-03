import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { InfoHeader } from '../components/temptationInfo/InfoHeader'
import { RemainingTime } from '../components/temptationInfo/RemainingTime'
import { InfoBox } from '../components/temptationInfo/InfoBox'
import { ActionButton } from '../components/temptationInfo/ActionButton'
import styles from './TemptationInfo.module.css'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useEffect, useState } from 'react'
import { useWishlistContext } from '../hooks/WishlistContext'
import { useWishlistDetail } from '../hooks/useWishlistDetail'

export default function TemptationInfo() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    filteredProducts,
    handleDelete,
    isDeleting,
    isDeleteSuccess,
    isDeleteError,
    isDeleteUnauthorized,
    deleteErrorKind,
    resetDeleteStatus,
  } = useWishlistContext()

  const product = filteredProducts.find((p) => p.id === id)

  const [isGiveUpOpen, setIsGiveUpOpen] = useState(false)
  const isGiveUpDialogOpen = isGiveUpOpen && !isDeleteSuccess && !isDeleteError

  const { isUnauthorized: isDetailUnauthorized, errorKind } = useWishlistDetail(id)

  // 고민 시간이 끝나면 재판단 화면으로 넘깁니다.
  // 이미 지난 채로 들어온 경우엔 즉시, 아직 남았다면 남은 시간만큼 기다린 뒤 이동합니다.
  const deadlineMs = product?.time.getTime()
  useEffect(() => {
    if (!id || deadlineMs === undefined) return

    const goJudge = () => navigate(`/temptation/${id}/judge`, { replace: true })
    const remainMs = deadlineMs - Date.now()

    if (remainMs <= 0) {
      goJudge()
      return
    }

    const timer = setTimeout(goJudge, remainMs)
    return () => clearTimeout(timer)
  }, [id, deadlineMs, navigate])

  // 포기하기 성공 시 목록 화면으로 이동합니다.
  useEffect(() => {
    if (!isDeleteSuccess) return
    resetDeleteStatus()
    navigate('/temptation')
  }, [isDeleteSuccess, navigate, resetDeleteStatus])

  const handleBack = () => {
    navigate('/temptation')
  }

  const handleEdit = () => {
    navigate(`/temptation/${id}/edit`)
  }

  const handleGiveUpOpen = () => {
    resetDeleteStatus()
    setIsGiveUpOpen(true)
  }

  const handleGiveUpCancel = () => {
    if (isDeleting) return
    setIsGiveUpOpen(false)
    resetDeleteStatus()
  }

  const handleGiveUpConfirm = () => {
    if (!product || isDeleting) return
    handleDelete(product.id)
  }

  const handleRetryableDeleteErrorConfirm = () => {
    resetDeleteStatus()
  }

  const handleDeleteNotFoundConfirm = () => {
    resetDeleteStatus()
    setIsGiveUpOpen(false)
    navigate('/temptation')
  }

  const handleDeleteForbiddenConfirm = () => {
    resetDeleteStatus()
    setIsGiveUpOpen(false)
  }

  const handleUnauthorizedConfirm = () => {
    resetDeleteStatus()
    navigate('/login')
  }

  const handleErrorConfirm = () => {
    navigate('/temptation')
  }

  if (errorKind === 'NOT_FOUND') {
    return (
      <ConfirmDialog
        isOpen
        title="상품을 찾을 수 없습니다."
        description="삭제되었거나 존재하지 않는 상품입니다."
        onlyConfirm
        confirmText="확인"
        onCancel={handleErrorConfirm}
        onConfirm={handleErrorConfirm}
      />
    )
  }

  if (errorKind === 'FORBIDDEN') {
    return (
      <ConfirmDialog
        isOpen
        title="접근 권한이 없습니다."
        description="본인의 위시리스트 항목만 확인할 수 있습니다."
        onlyConfirm
        confirmText="확인"
        onCancel={handleErrorConfirm}
        onConfirm={handleErrorConfirm}
      />
    )
  }

  if (isDetailUnauthorized || isDeleteUnauthorized) {
    return (
      <ConfirmDialog
        isOpen
        title="로그인이 필요합니다."
        description="로그인 후 이용해주세요."
        onlyConfirm
        confirmText="확인"
        onCancel={handleUnauthorizedConfirm}
        onConfirm={handleUnauthorizedConfirm}
      />
    )
  }

  if (!product) {
    // 방금 포기하기가 성공해 목록에서 사라진 직후라면 곧 /temptation으로 이동하니 빈 화면만 보여줍니다.
    if (isDeleteSuccess) return null
    return <p>상품을 찾을 수 없습니다.</p>
  }

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton onClick={handleBack} />}
        subMain={<InfoHeader category={product.category} name={product.name} />}
      />
      {product && (
        <div className={styles.wrapper}>
          <RemainingTime deadline={product.time} createdAt={product.createdAt} />
          <InfoBox
            price={product.price}
            reason={product.reason ?? undefined}
            link={product.link ?? undefined}
          />
          <ActionButton onEdit={handleEdit} onGiveUp={handleGiveUpOpen} />
        </div>
      )}

      <ConfirmDialog
        isOpen={isGiveUpDialogOpen}
        title="이 상품을 포기하시겠습니까?"
        description="포기한 금액은 참은 소비 기록에 반영됩니다."
        cancelText="취소"
        confirmText="포기하기"
        isLoading={isDeleting}
        onCancel={handleGiveUpCancel}
        onConfirm={handleGiveUpConfirm}
      />

      <ConfirmDialog
        isOpen={
          isDeleteError &&
          !isDeleteUnauthorized &&
          deleteErrorKind !== 'NOT_FOUND' &&
          deleteErrorKind !== 'FORBIDDEN'
        }
        title="처리하지 못했습니다."
        description="잠시 후 다시 시도해주세요."
        onlyConfirm
        confirmText="확인"
        onCancel={handleRetryableDeleteErrorConfirm}
        onConfirm={handleRetryableDeleteErrorConfirm}
      />

      <ConfirmDialog
        isOpen={deleteErrorKind === 'NOT_FOUND'}
        title="상품을 찾을 수 없습니다."
        description="이미 삭제되었거나 존재하지 않는 상품입니다."
        onlyConfirm
        confirmText="확인"
        onCancel={handleDeleteNotFoundConfirm}
        onConfirm={handleDeleteNotFoundConfirm}
      />

      <ConfirmDialog
        isOpen={deleteErrorKind === 'FORBIDDEN'}
        title="접근 권한이 없습니다."
        description="본인의 위시리스트 항목만 삭제할 수 있습니다."
        onlyConfirm
        confirmText="확인"
        onCancel={handleDeleteForbiddenConfirm}
        onConfirm={handleDeleteForbiddenConfirm}
      />
    </>
  )
}
