import { useEffect, useState } from 'react';
import { useBlocker, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { PiListBold } from 'react-icons/pi';
import { IoNotifications } from 'react-icons/io5';
import Header from '@/components/layout/Header';
import { InfoHeader } from '../components/temptationInfo/InfoHeader';
import { ProductForm } from '@/components/layout/ProductForm';
import type { FormData as WishFormData } from '@/components/layout/ProductForm';
import { useWishlistContext } from '../hooks/WishlistContext';
import styles from './TemptationEdit.module.css';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function TemptationEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { filteredProducts, handleEdit } = useWishlistContext();

  const product = filteredProducts.find((p) => p.id === id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isFailOpen, setIsFailOpen] = useState(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const [isManualLeaveOpen, setIsManualLeaveOpen] = useState(false);

  const handleBack = () => {
    if (isDirty) {
      setIsManualLeaveOpen(true);
    } else {
      navigate(`/temptation/${id}`);
    }
  };

  const isLeaveConfirmOpen = blocker.state === 'blocked' || isManualLeaveOpen;

  const handleLeaveCancel = () => {
    setIsManualLeaveOpen(false);
    blocker.reset?.();
  };

  const handleLeaveConfirm = () => {
    setIsManualLeaveOpen(false);
    if (blocker.state === 'blocked') {
      blocker.proceed?.();
    } else {
      navigate(`/temptation/${id}`);
    }
  };

  const handleSave = async (data: WishFormData, meta: { timeChanged: boolean }) => {
    if (!product || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // 백엔드 연동 시 실제 수정 요청으로 교체
      await new Promise((resolve) => setTimeout(resolve, 400));
      handleEdit(product.id, data, meta.timeChanged);
      setIsSubmitting(false);
      setIsDirty(false); // 저장 성공 후에는 dirty 해제 (상세 페이지 이동 시 재차단 방지)
      setIsSuccessOpen(true);
    } catch {
      setIsSubmitting(false);
      setIsFailOpen(true);
    }
  };

  const handleSuccessConfirm = () => {
    setIsSuccessOpen(false);
    navigate(`/temptation/${id}`);
  };

  const handleFailConfirm = () => {
    setIsFailOpen(false);
  };

  if (!product) {
    return <p>상품을 찾을 수 없습니다.</p>;
  }

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
        subMain={<InfoHeader category={product.category} name={product.name} />}
      />
      <div className={styles.wrapper}>
        <ProductForm
          formId="edit-wishlist-form"
          initialData={{
            link: product.link,
            price: product.price,
            name: product.name,
            category: product.category,
            time: product.timeOption,
            reason: product.reason,
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
          disabled={isSubmitting}
        >
          {isSubmitting ? '•  •  •' : '수정사항 저장하기'}
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
        isOpen={isSuccessOpen}
        title="수정사항이 저장되었습니다."
        onlyConfirm
        variant="success"
        confirmText="확인"
        onCancel={handleSuccessConfirm}
        onConfirm={handleSuccessConfirm}
      />

      <ConfirmDialog
        isOpen={isFailOpen}
        title="수정사항을 저장하지 못했습니다."
        description="다시 시도해주세요."
        onlyConfirm
        confirmText="확인"
        onCancel={handleFailConfirm}
        onConfirm={handleFailConfirm}
      />
    </>
  );
}