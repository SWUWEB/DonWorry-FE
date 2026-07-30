import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { PiListBold } from 'react-icons/pi';
import { IoNotifications, IoAlertCircle, IoHourglassOutline, IoCartOutline } from 'react-icons/io5';
import Header from '@/components/layout/Header';
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

  const handleBack = () => {
    navigate('/temptation');
  };

  const handleExtendConfirm = () => {
    if (!product || isProcessing) return;
    handleExtend(product.id, selectedExtend);
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
    // TODO: 실제 구매 확인 화면과 연결 예정 (다른 팀원 구현 화면)
    navigate(`/temptation/${product.id}/purchase`);
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
      />
      <div className={styles.wrapper}>
        <h2 className={styles.title}>고민 시간 종료</h2>
        <p className={styles.subtitle}>이제 결정할 시간이에요. 신중하게 선택해보세요.</p>

        <div className={styles.warningBanner}>
          <IoAlertCircle size={20} className={styles.warningIcon} />
          <div>
            <p className={styles.warningTitle}>설정한 고민 시간 {totalHours}시간이 지났어요</p>
            <p className={styles.warningDescription}>시간 연장 또는 구매 여부를 결정해주세요.</p>
          </div>
        </div>

        <ProductSummaryCard category={product.category} name={product.name} price={product.price} />

        <section className={styles.section}>
          <p className={styles.sectionTitle}>
            <IoHourglassOutline size={18} /> 고민 시간 연장
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
            onClick={handleExtendConfirm}
            disabled={isProcessing}
          >
            {selectedExtend} 연장 확정하기
          </button>
        </section>

        <p className={styles.divider}>또는 지금 결정하기</p>

        <section className={styles.section}>
          <p className={styles.sectionTitle}>
            <IoCartOutline size={18} /> 지금 결정하기
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
        </section>
      </div>
    </>
  );
}