import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoAlertCircleOutline } from 'react-icons/io5'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useWishlistContext } from '../hooks/WishlistContext'
import { ProductSummaryCard } from '../components/temptationJudge/ProductSummaryCard'
import { TIME_OPTIONS } from '@/constants/product'
import type { Product } from '../types'
import styles from './TemptationJudge.module.css'

export default function TemptationJudge() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    filteredProducts,
    isLoading,
    isUnauthorized,
    handleExtend,
    isExtending,
    isExtendSuccess,
    isExtendError,
    isExtendUnauthorized,
    resetExtendStatus,
    handleJudgeDecision,
    isDeciding,
    isDecideSuccess,
    isDecideError,
    isDecideUnauthorized,
    resetDecideStatus,
  } = useWishlistContext()

  const product = filteredProducts.find((p) => p.id === id)
  const [selectedExtend, setSelectedExtend] = useState<(typeof TIME_OPTIONS)[number]>('1일')
  const [isExtendConfirmOpen, setIsExtendConfirmOpen] = useState(false)
  // 살래요/안 살래요 중 어떤 결정을 보냈는지, 그 시점의 상품 정보를 기억해뒀다가 성공하면 그에 맞는
  // 화면으로 이동합니다. 결정이 성공하면 목록 캐시에서 즉시 제거되어 product가 undefined가 되므로,
  // 이동 시점에 필요한 정보를 product에서 다시 읽지 않고 클릭 시점의 스냅샷을 그대로 씁니다.
  const [pendingDecision, setPendingDecision] = useState<{
    type: 'BUY' | 'SKIP'
    product: Product
  } | null>(null)

  const isExtendDialogOpen = isExtendConfirmOpen && !isExtendSuccess && !isExtendError

  // 아직 고민 시간이 남은 상품은 재판단 대상이 아니므로 상세로 돌려보냅니다.
  // (상세 화면은 반대로 시간이 끝나면 이 화면으로 보냅니다 — 조건이 서로 배타적이라 왕복하지 않습니다.)
  const deadlineMs = product?.time.getTime()
  useEffect(() => {
    if (!id || deadlineMs === undefined) return
    if (deadlineMs > Date.now()) {
      navigate(`/temptation/${id}`, { replace: true })
    }
  }, [id, deadlineMs, navigate])

  const handleBack = () => {
    navigate('/temptation')
  }

  const handleExtendClick = () => {
    if (!product || isDeciding || isExtending) return
    setIsExtendConfirmOpen(true)
  }

  const handleExtendCancel = () => {
    if (isExtending) return
    setIsExtendConfirmOpen(false)
  }

  const handleExtendConfirm = () => {
    if (!product || isDeciding || isExtending) return
    handleExtend(product.id, selectedExtend)
  }

  // 연장 성공 시: 확인 다이얼로그를 닫고 상세 화면으로 이동.
  useEffect(() => {
    if (isExtendSuccess && id) {
      resetExtendStatus()
      navigate(`/temptation/${id}`, { replace: true })
    }
  }, [isExtendSuccess, id, navigate, resetExtendStatus])

  const handleExtendFailConfirm = () => {
    resetExtendStatus()
  }

  // 구매/포기 결정 성공 시: 결정 종류에 맞는 화면으로 이동.
  useEffect(() => {
    if (!isDecideSuccess || !pendingDecision) return
    resetDecideStatus()
    const { type, product: decidedProduct } = pendingDecision

    if (type === 'SKIP') {
      navigate('/temptation/saved', {
        state: {
          name: decidedProduct.name,
          category: decidedProduct.category,
          price: decidedProduct.price,
        },
      })
    } else {
      // RecordInterventionPage는 { draft: RecordDraft } 형태의 state를 기대합니다.
      navigate('/record/intervention', {
        state: {
          draft: {
            title: decidedProduct.name,
            amount: decidedProduct.price,
            category: decidedProduct.category,
            reason: decidedProduct.reason ?? '',
            productUrl: decidedProduct.link ?? undefined,
          },
        },
      })
    }
  }, [isDecideSuccess, pendingDecision, navigate, resetDecideStatus])

  const handleDecideFailConfirm = () => {
    resetDecideStatus()
    setPendingDecision(null)
  }

  const handleNotBuy = () => {
    if (!product || isDeciding || isExtending) return
    setPendingDecision({ type: 'SKIP', product })
    handleJudgeDecision(product.id, 'SKIP')
  }

  const handleBuy = () => {
    if (!product || isDeciding || isExtending) return
    setPendingDecision({ type: 'BUY', product })
    handleJudgeDecision(product.id, 'BUY')
  }

  const handleUnauthorizedConfirm = () => {
    resetExtendStatus()
    resetDecideStatus()
    setPendingDecision(null)
    navigate('/login')
  }

  if (isUnauthorized || isExtendUnauthorized || isDecideUnauthorized) {
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
    // 방금 결정이 성공해 목록에서 사라진 직후라면 곧 다른 화면으로 이동하니 빈 화면만 보여줍니다.
    if (pendingDecision) return null
    if (isLoading) return <p>불러오는 중...</p>
    return <p>상품을 찾을 수 없습니다.</p>
  }

  const totalHours = Math.round(
    (product.time.getTime() - product.createdAt.getTime()) / (60 * 60 * 1000),
  )
  const isProcessing = isDeciding || isExtending

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton onClick={handleBack} />}
        subMain={
          <div className={styles.headerText}>
            <h2 className={styles.headerTitle}>고민 시간 종료</h2>
            <p className={styles.headerDescription}>
              이제 결정할 시간이에요. 신중하게 선택해보세요.
            </p>
          </div>
        }
      />
      <div className={styles.wrapper}>
        <div className={styles.warningBanner}>
          <IoAlertCircleOutline size={20} className={styles.warningIcon} />
          <div>
            <p className={styles.warningTitle}>설정한 고민 시간 {totalHours}시간이 지났어요</p>
            <p className={styles.warningDescription}>시간 연장 또는 구매 여부를 결정해주세요.</p>
          </div>
        </div>

        <ProductSummaryCard category={product.category} name={product.name} price={product.price} />

        <div className={styles.sectionBox}>
          <p className={styles.sectionTitle}>⏳ 고민 시간 연장</p>
          <p className={styles.sectionDescription}>아직 결정이 어렵다면 시간을 더 가져요.</p>

          <div className={styles.chipGroup}>
            {TIME_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.chip} ${selectedExtend === option ? styles.chipSelected : ''}`}
                onClick={() => setSelectedExtend(option)}
                disabled={isProcessing}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.extendConfirmBtn}
            onClick={handleExtendClick}
            disabled={isProcessing}
          >
            {selectedExtend} 연장 확정하기
          </button>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>또는 지금 결정하기</span>
          <span className={styles.dividerLine} />
        </div>

        <div className={`${styles.sectionBox} ${styles.decisionSection}`}>
          <p className={styles.sectionTitle}>🛒 지금 결정하기</p>
          <p className={styles.sectionDescription}>고민 끝에 내린 결정을 선택해주세요.</p>

          <div className={styles.decisionRow}>
            <button
              type="button"
              className={styles.notBuyBtn}
              onClick={handleNotBuy}
              disabled={isProcessing}
            >
              <span className={styles.decisionMain}>안 살래요</span>
              <span className={styles.decisionSub}>참을게요</span>
            </button>
            <button
              type="button"
              className={styles.buyBtn}
              onClick={handleBuy}
              disabled={isProcessing}
            >
              <span className={styles.decisionMain}>살래요</span>
              <span className={styles.decisionSub}>점검 후 구매</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isExtendDialogOpen}
        isLoading={isExtending}
        title={`고민 시간을 ${selectedExtend} 연장할까요?`}
        cancelText="취소"
        confirmText="연장하기"
        onCancel={handleExtendCancel}
        onConfirm={handleExtendConfirm}
      />

      <ConfirmDialog
        isOpen={isExtendError}
        title="연장에 실패했습니다."
        description="다시 시도해주세요."
        onlyConfirm
        confirmText="확인"
        onCancel={handleExtendFailConfirm}
        onConfirm={handleExtendFailConfirm}
      />

      <ConfirmDialog
        isOpen={isDecideError && !isDecideUnauthorized}
        title="결정을 저장하지 못했습니다."
        description="다시 시도해주세요."
        onlyConfirm
        confirmText="확인"
        onCancel={handleDecideFailConfirm}
        onConfirm={handleDecideFailConfirm}
      />
    </>
  )
}
