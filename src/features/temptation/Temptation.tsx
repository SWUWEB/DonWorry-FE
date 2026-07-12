import Header from '@/components/layout/Header'
import { PiListBold } from "react-icons/pi";
import { IoNotifications } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import SearchBar from './components/SearchBar';
import { useMemo, useState } from 'react';
import styles from './Temptation.module.css'
import { useNow } from './hooks/useNow';
import TemptationMain from './pages/TemptationMain';
import { Search } from './pages/Search';
import { MOCK_PRODUCTS } from './mockData';

export default function Temptation() {
  const [keyword, setKeyword] = useState('');
  useNow();

  const trimmedKeyword = keyword.trim();

  const filteredProducts = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(trimmed));
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
      {trimmedKeyword ? (
        <Search keyword={keyword} filteredProducts={filteredProducts} />
      ) : (
        <TemptationMain keyword={keyword} />
      )}
    </>
  )
}