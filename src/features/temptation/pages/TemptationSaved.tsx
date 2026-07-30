import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { PiListBold } from 'react-icons/pi';
import { IoNotifications } from 'react-icons/io5';
import Header from '@/components/layout/Header';
import { ProductSummaryCard } from '../components/temptationJudge/ProductSummaryCard';
import type { Category } from '../types';
import styles from './TemptationSaved.module.css';

interface SavedLocationState {
  name: string;
  category: Category;
  price: number;
}

export default function TemptationSaved() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SavedLocationState | null;

  const handleBack = () => {
    navigate('/temptation');
  };

  const handleGoHome = () => {
    navigate('/temptation');
  };

  if (!state) {
    return <p>표시할 정보가 없습니다.</p>;
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
      />
      <div className={styles.wrapper}>
        <h2 className={styles.title}>잘 참았어요!</h2>
        <p className={styles.subtitle}>충동 소비를 이겨냈어요. 참은 기록에 추가될 거예요.</p>

        <div className={styles.celebrateIcon} aria-hidden="true">🎉</div>

        <ProductSummaryCard category={state.category} name={state.name} price={state.price} savedMode />

        <div className={styles.praiseBox}>
          <p className={styles.praiseTitle}>오늘 정말 잘 했어요 👏</p>
          <p className={styles.praiseDescription}>
            충동 소비를 한 번 이겨낼 때마다 더 나은 소비 습관이 만들어져요. 오늘의 선택이 쌓여 미래의 나를 바꿔줄 거예요.
          </p>
        </div>

        <button type="button" className={styles.homeBtn} onClick={handleGoHome}>
          홈으로 돌아가기
        </button>
      </div>
    </>
  );
}