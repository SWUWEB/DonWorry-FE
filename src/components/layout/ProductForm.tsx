import { useState } from 'react';
import styles from './ProductForm.module.css';
import { CATEGORIES, TIME_OPTIONS } from '@/constants/product';

export interface FormData {
  link: string;
  price: number;
  name: string;
  category: string;
  time: string;
  reason: string;
}

interface FormProps {
  showTimeSelector?: boolean;
  onSubmit: (data: FormData) => void;
}

export function ProductForm({ showTimeSelector = true, onSubmit }: FormProps) {
  const [data, setData] = useState<FormData>({
    link: '', price: 0, name: '', category: '패션', time: '1일', reason: ''
  });

  // const [linkStatus, setLinkStatus] = useState<{
  //   loading: boolean;
  //   error: boolean;
  // }>({ loading: false, error: false });

  // const handleLinkFetch = async () => {
  //   if (!data.link.trim()) return;
  //   setLinkStatus({ loading: true, error: false });
    
  //   try {
  //     const result = await ~~~(data.link);  // API 호출부
  //     setData(prev => ({
  //       ...prev,
  //       name: result.name,
  //       price: result.price,
  //     }));
  //     setLinkStatus({ loading: false, error: false });
  //   } catch (err) {
  //     setLinkStatus({ loading: false, error: true });
  //   }
  // };
    
  const [touched, setTouched] = useState({ price: false, name: false });
  const handleBlur = (field: 'price' | 'name') => setTouched({ ...touched, [field]: true });
  
  const priceError = touched.price && data.price === 0;
  const nameError = touched.name && data.name.trim() === '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isPriceEmpty = data.price === 0;
    const isNameEmpty = data.name.trim() === '';

    if (isPriceEmpty || isNameEmpty) {
      setTouched({ price: true, name: true });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      
      <div className={styles.field}>
        <label className={styles.label}>상품 링크 (선택)</label>
        <div className={styles.inputWrapper}>
          <input
            className={styles.textInput}
            placeholder="https://..."
            value={data.link}
            onChange={(e) => {
              setData({...data, link: e.target.value});
              // if (linkStatus.error) setLinkStatus({ loading: false, error: false});
            }} />
          <button
            type="button"
            className={styles.button}
            // disabled={linkStatus.loading || !data.link.trim()}
            // onClick={handleLinkFetch}
            // {linkStatus.loading ? '• • •' : '불러오기'}
            >불러오기</button>
        </div>
        {/* {linkStatus.error && ( */}
          <p className={`${styles.message} ${styles.errorMessage}`}>URL을 불러오는 데 실패했습니다.</p>
        {/* )} */}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>상품 가격</label>
        <div className={styles.priceWrapper}>
          <input 
            className={styles.priceInput} 
            type="text" 
            inputMode="numeric"
            placeholder="0"
            value={data.price === 0 ? '' : data.price.toLocaleString('ko-KR')}
            onBlur={() => handleBlur('price')}
            onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                setData({...data, price: rawValue === '' ? 0 : Number(rawValue)});
            }} 
          />
          <span className={styles.currency}>원</span>
        </div>
        {priceError && <p className={`${styles.message} ${styles.errorMessage}`}>상품 가격은 필수 입력 사항입니다.</p>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>상품명</label>
        <input
          className={styles.textInput}
          placeholder="직접 입력하거나 수정할 수 있어요"
          value={data.name}
          onBlur={() => handleBlur('name')}
          onChange={(e) => setData({...data, name: e.target.value})} />
        {nameError && <p className={`${styles.message} ${styles.errorMessage}`}>상품명은 필수 입력 사항입니다.</p>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>카테고리</label>
        <div className={styles.chipGroup}>
          {CATEGORIES.map(c => (
            <div key={c} className={`${styles.chip} ${data.category === c ? styles.chipSelected : ''}`} 
                 onClick={() => setData({...data, category: c})}>{c}</div>
          ))}
        </div>
      </div>

      {showTimeSelector && (
        <div className={styles.field}>
          <label className={styles.label}>고민해볼 시간</label>
          <div className={styles.chipGroup}>
            {TIME_OPTIONS.map(t => (
              <div key={t} className={`${styles.chip} ${data.time === t ? styles.chipSelected : ''}`} 
                   onClick={() => setData({...data, time: t})}>{t}</div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>사고 싶은 이유 (선택)</label>
        <input
          className={styles.textInput}
          placeholder="스트레스 받아서? 진짜 필요해서?"
          value={data.reason}
          onChange={(e) => setData({...data, reason: e.target.value})} />
      </div>
    </form>
  );
}