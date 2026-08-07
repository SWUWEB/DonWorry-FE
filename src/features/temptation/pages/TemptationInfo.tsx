import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import HeaderBackButton from '@/shared/components/HeaderBackButton';
import { InfoHeader } from '../components/temptationInfo/InfoHeader';
import { RemainingTime } from '../components/temptationInfo/RemainingTime';
import { InfoBox } from '../components/temptationInfo/InfoBox';
import { ActionButton } from '../components/temptationInfo/ActionButton';
import styles from './TemptationInfo.module.css';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useState } from 'react';
import { useWishlistContext } from '../hooks/WishlistContext';

export default function TemptationInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { filteredProducts, handleDelete } = useWishlistContext();
  
  const product = filteredProducts.find((p) => p.id === id);

  const [isGiveUpOpen, setIsGiveUpOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleBack = () => {
    navigate('/temptation');
  };

  const handleEdit = () => {
    navigate(`/temptation/${id}/edit`);
  };

  const handleGiveUpOpen = () => {
    setErrorMessage('');
    setIsGiveUpOpen(true);
  };

  const handleGiveUpCancel = () => {
    if (isSubmitting) return;
    setIsGiveUpOpen(false);
    setErrorMessage('');
  };

  const handleGiveUpConfirm = async () => {
    if (!product) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 백엔드 연동 시 실제 삭제 요청으로 교체 필요
      await new Promise((resolve) => setTimeout(resolve, 400));
      handleDelete(product.id);
      navigate('/temptation');
    } catch {
      setErrorMessage('처리하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return <p>상품을 찾을 수 없습니다.</p>;
  }

  return (
    <>
      <Header
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton onClick={handleBack} />}
        subMain={<InfoHeader category={product.category} name={product.name} />}
      />
      <div className={styles.wrapper}>
        <RemainingTime deadline={product.time} createdAt={product.createdAt} />
        <InfoBox
          price={product.price}
          reason={product.reason}
          link={product.link}
        />
        <ActionButton onEdit={handleEdit} onGiveUp={handleGiveUpOpen} />
      </div>

      <ConfirmDialog
        isOpen={isGiveUpOpen}
        title="이 상품을 포기하시겠습니까?"
        description="포기한 금액은 참은 소비 기록에 반영됩니다."
        cancelText="취소"
        confirmText="포기하기"
        isLoading={isSubmitting}
        errorMessage={errorMessage}
        onCancel={handleGiveUpCancel}
        onConfirm={handleGiveUpConfirm}
      />
    </>
  );
}