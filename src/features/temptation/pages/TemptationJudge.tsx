import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { PiListBold } from 'react-icons/pi';
import { IoNotifications, IoAlertCircleOutline } from 'react-icons/io5';
import Header from '@/components/layout/Header';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import { useWishlistContext } from '../hooks/WishlistContext';
import { ProductSummaryCard } from '../components/temptationJudge/ProductSummaryCard';
import { TIME_OPTIONS } from '@/constants/product';
import styles from './TemptationJudge.module.css';

export default function TemptationJudge() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { filteredProducts, handleDelete, handleExtend } = useWishlistContext();

  const product = filteredProducts.find((p) => p.id === id);
  const [selectedExtend, setSelectedExtend] = useState<typeof TIME_OPTIONS[number]>('1일');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtendConfirmOpen, setIsExtendConfirmOpen] = useState(false);

  const handleBack = () => {
    navigate('/temptation');
  };

  const handleExtendClick = () => {
    if (!product || isProcessing) return;
    setIsExtendConfirmOpen(true);
  };

  const handleExtendCancel = () => {
    setIsExtendConfirmOpen(false);
  };

  const handleExtendConfirm = () => {
    if (!product) return;
    handleExtend(product.id, selectedExtend);
    setIsExtendConfirmOpen(false);
    navigate(`/temptation/${product.id}`);
  };

  const handleNotBuy = () => {
    if (!product || isProcessing) return;
    setIsProcessing(true);
    // TODO: 참은 소비 기록 저장 로직 추가 필요 (추후 구현 예정)
    handleDelete(product.id);
    navigate('/temptation/saved', {
      state: {
        name: product.name,
        category: product.category,
        price: product.price,
      },
    });
  };

const handleBuy = () => {
  if (!product) return;
  navigate('/record/intervention', {
    state: {
      from: 'temptation',
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productCategory: product.category,
    },
  });
};

  if (!product) {
    return <p>상품을 찾을 수 없습니다.</p>;
  }

  const totalHours = Math.round(
    (product.time.getTime() - product.createdAt.getTime()) / (60 * 60 * 1000)
  );

  return (
    <>
      <Header
        left={<button type="button" aria-label="로고">Logo</button>}
        right={
          <>
            <button type="button" aria-label="알림"><IoNotifications /></button>
            <button type="button" aria-label="메뉴 열기"><PiListBold /></button>
          </>
        }
        subLeft={
          <button type="button" aria-label="뒤로가기" onClick={handleBack}>
            <IoIosArrowBack size={25} />
          </button>
        }
        subMain={
          <>
            <h2 style={{ margin: '8px 0 4px', fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              고민 시간 종료
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-gray-300)' }}>
              이제 결정할 시간이에요. 신중하게 선택해보세요.
            </p>
          </>
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
          <p className={styles.sectionTitle}>
            ⏳ 고민 시간 연장
          </p>
          <p className={styles.sectionDescription}>아직 결정이 어렵다면 시간을 더 가져요.</p>

          <div className={styles.chipGroup}>
            {TIME_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.chip} ${selectedExtend === option ? styles.chipSelected : ''}`}
                onClick={() => setSelectedExtend(option)}
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

        <div className={styles.sectionBox} style={{ paddingBottom: 20 }}>
          <p className={styles.sectionTitle}>
            🛒 지금 결정하기
          </p>
          <p className={styles.sectionDescription}>고민 끝에 내린 결정을 선택해주세요.</p>

          <div className={styles.decisionRow}>
            <button type="button" className={styles.notBuyBtn} onClick={handleNotBuy} disabled={isProcessing}>
              <span className={styles.decisionMain}>안 살래요</span>
              <span className={styles.decisionSub}>참을게요</span>
            </button>
            <button type="button" className={styles.buyBtn} onClick={handleBuy} disabled={isProcessing}>
              <span className={styles.decisionMain}>살래요</span>
              <span className={styles.decisionSub}>점검 후 구매</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isExtendConfirmOpen}
        title={`고민 시간을 ${selectedExtend} 연장할까요?`}
        cancelText="취소"
        confirmText="연장하기"
        onCancel={handleExtendCancel}
        onConfirm={handleExtendConfirm}
      />
    </>
  );
}