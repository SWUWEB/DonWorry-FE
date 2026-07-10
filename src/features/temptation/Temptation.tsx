import Header from '@/components/layout/Header'
import { PiListBold } from "react-icons/pi";
import { IoNotifications } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import SearchBar from './components/SearchBar';
import { Search } from './components/Search';
import { useMemo, useState } from 'react';
import styles from './Temptation.module.css'
import type { Product } from './types';
import { useNow } from './hooks/useNow';

const hoursFromNow = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000);
const TEMP_TEST_PRODUCTS: Product[] = [
  { id: '1', name: '스탠다드 유넥 반팔티', price: 21000, time: hoursFromNow(13), category: '패션' },
  { id: '2', name: '와이드 데님 팬츠', price: 30000, time: hoursFromNow(48), category: '패션' },
  { id: '3', name: '생딸기 몽땅 요아정 (2인)', price: 14000, time: hoursFromNow(13), category: '카페/디저트' },
  { id: '4', name: '두쫀쿠', price: 5000, time: hoursFromNow(24), category: '카페/디저트' },
  { id: '5', name: '쏘내추럴 메이크업 세팅 픽서', price: 24000, time: hoursFromNow(72), category: '뷰티' },
];

export default function Temptation() {
  const [keyword, setKeyword] = useState('');
  useNow();

  const filteredProducts = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return TEMP_TEST_PRODUCTS;
    return TEMP_TEST_PRODUCTS.filter((p) => p.name.toLowerCase().includes(trimmed));
  }, [keyword]);

  return (
    <>
      <Header
        left={
          <button type="button" aria-label="로고">Logo</button>
        }
        right={
          <>
            <button type="button" aria-label="알림"><IoNotifications /></button>
            <button type="button" aria-label="메뉴 열기"><PiListBold /></button>
          </>
        }
        subLeft={
          <button type="button" aria-label="뒤로가기"><IoIosArrowBack size={25}/></button>
        }
        subMain={
          <>
            <h2 className={styles.subHeading}>유혹 관리</h2>
            <SearchBar value={keyword} onChange={setKeyword} placeholder="위시리스트 검색" />
          </>
        }
      />
      <Search keyword={keyword} filteredProducts={filteredProducts} />
    </>
  )
}