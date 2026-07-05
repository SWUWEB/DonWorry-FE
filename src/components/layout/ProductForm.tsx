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
  formId?: string;
  showTimeSelector?: boolean;
  onSubmit: (data: FormData) => void;
}

export function ProductForm({ formId = 'product-form', showTimeSelector = true, onSubmit }: FormProps) {
  const [data, setData] = useState<FormData>({
    link: '', price: 0, name: '', category: '패션', time: '1일', reason: ''
  });

  const [linkStatus, setLinkStatus] = useState<{
    loading: boolean;
    error: boolean;
    success?: boolean;
  }>({ loading: false, error: false, success: false });

  const handleLinkFetch = async () => {
    if (!data.link.trim()) return;
    setLinkStatus({ loading: true, error: false, success: false });
    
    try {
      const result = await fetchProductData(data.link);  // API 호출부
      setData(prev => ({
        ...prev,
        name: result.name,
        price: result.price,
      }));
      setLinkStatus({ loading: false, error: false, success: true });
    } catch {
      setLinkStatus({ loading: false, error: true, success: false });
    }
  };
    
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
    <form id={formId} className={styles.formContainer} onSubmit={handleSubmit}>
      
      <div className={styles.field}>
        <label className={styles.label}>상품 링크 (선택)</label>
        <div className={styles.inputWrapper}>
          <input
            className={styles.textInput}
            placeholder="https://..."
            value={data.link}
            onChange={(e) => {
              setData({...data, link: e.target.value});
              if (linkStatus.error || linkStatus.success) {
                setLinkStatus({ loading: false, error: false, success: false });
              }
              
            }} />
          <button
            type="button"
            className={styles.button}
            disabled={linkStatus.loading || !data.link.trim()}
            onClick={handleLinkFetch}
            >
              {linkStatus.loading ? '• • •' : '불러오기'}
            </button>
        </div>
        {linkStatus.error && (
          <p className={`${styles.message} ${styles.errorMessage}`}>URL을 불러오는 데 실패했습니다.</p>
        )}
        {linkStatus.success && (
          <p className={`${styles.message} ${styles.successMessage}`}>URL을 성공적으로 불러왔습니다.</p>
        )}
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
        <div className={styles.chipGroup} role="radiogroup">
          {CATEGORIES.map(c => (
            <label key={c} className={`${styles.chip} ${data.category === c ? styles.chipSelected : ''}`}>
              <input
                type="radio" name="category" value={c} className={styles.hidden}
                checked={data.category === c} onChange={() => setData({...data, category: c})}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {showTimeSelector && (
        <div className={styles.field}>
          <label className={styles.label}>고민해볼 시간</label>
          <div className={styles.chipGroup} role="radiogroup">
            {TIME_OPTIONS.map(t => (
              <label key={t} className={`${styles.chip} ${data.time === t ? styles.chipSelected : ''}`}> 
                <input
                  type="radio" name="time" value={t} className={styles.hidden}
                  checked={data.time === t}
                  onChange={() => setData({...data, time: t})}
                />   
                {t}
              </label>
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

// 임시 코드: 실제 API 호출 로직 구현 필요
async function fetchProductData(link: string): Promise<{ name: string; price: number }> {
  console.log('fetchProductData called with link:', link);
  throw new Error('Not implemented');
}