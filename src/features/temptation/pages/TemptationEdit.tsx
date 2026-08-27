import { useEffect, useState } from 'react'
import { useBlocker, useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { InfoHeader } from '../components/temptationInfo/InfoHeader'
import { ProductForm } from '@/components/layout/ProductForm'
import type { FormData as WishFormData } from '@/components/layout/ProductForm'
import { useWishlistContext } from '../hooks/WishlistContext'
import styles from './TemptationEdit.module.css'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'

export default function TemptationEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    filteredProducts,
    handleEdit,
    isEditing,
    isEditSuccess,
    isEditError,
    editErrorKind,
    resetEditStatus,
  } = useWishlistContext()

  const errorMessageMap: Record<string, { title: string; description: string }> = {
    EMPTY: { title: '수정할 내용이 없습니다.', description: '변경된 항목이 있는지 확인해주세요.' },
    FORBIDDEN: {
      title: '접근 권한이 없습니다.',
      description: '본인의 위시리스트 항목만 수정할 수 있습니다.',
    },
    NOT_FOUND: {
      title: '상품을 찾을 수 없습니다.',
      description: '삭제되었거나 존재하지 않는 상품입니다.',
    },
  }

  const editErrorContent = editErrorKind
    ? errorMessageMap[editErrorKind]
    : { title: '수정사항을 저장하지 못했습니다.', description: '다시 시도해주세요.' }

  const product = filteredProducts.find((p) => p.id === id)
  const [isDirty, setIsDirty] = useState(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleBack = () => {
    navigate(`/temptation/${id}`)
  }

  const isLeaveConfirmOpen = blocker.state === 'blocked'

  const handleLeaveCancel = () => {
    blocker.reset?.()
  }

  const handleLeaveConfirm = () => {
    blocker.proceed?.()
  }

  const handleSave = (data: WishFormData) => {
    if (!product || isEditing) return
    handleEdit(product.id, data)
  }

  const handleSuccessConfirm = () => {
    setIsDirty(false)
    resetEditStatus()
    navigate(`/temptation/${id}`)
  }

  const handleFailConfirm = () => {
    resetEditStatus()
  }

  if (!product) {
    return <p>상품을 찾을 수 없습니다.</p>
  }

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton onClick={handleBack} />}
        subMain={<InfoHeader category={product.category} name={product.name} />}
      />
      <div className={styles.wrapper}>
        <ProductForm
          formId="edit-wishlist-form"
          initialData={{
            link: product.link ?? '',
            price: product.price,
            name: product.name,
            category: product.category,
            time: product.timeOption,
            reason: product.reason ?? '',
          }}
          onSubmit={handleSave}
          onDirtyChange={setIsDirty}
        />
      </div>

      <div className={styles.saveBtnWrapper}>
        <button
          type="submit"
          form="edit-wishlist-form"
          className={styles.saveBtn}
          disabled={isEditing}
        >
          {isEditing ? '•  •  •' : '수정사항 저장하기'}
        </button>
      </div>

      <ConfirmDialog
        isOpen={isLeaveConfirmOpen}
        title="수정한 내용이 저장되지 않습니다."
        description="나가시겠습니까?"
        cancelText="취소"
        confirmText="확인"
        onCancel={handleLeaveCancel}
        onConfirm={handleLeaveConfirm}
      />

      <ConfirmDialog
        isOpen={isEditSuccess}
        title="수정사항이 저장되었습니다."
        onlyConfirm
        variant="success"
        confirmText="확인"
        onCancel={handleSuccessConfirm}
        onConfirm={handleSuccessConfirm}
      />

      <ConfirmDialog
        isOpen={isEditError}
        title={editErrorContent.title}
        description={editErrorContent.description}
        onlyConfirm
        confirmText="확인"
        onCancel={handleFailConfirm}
        onConfirm={handleFailConfirm}
      />
    </>
  )
}
