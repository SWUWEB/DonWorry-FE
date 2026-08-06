import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import SearchBar from './components/SearchBar';
import styles from './Temptation.module.css'
import { useNow } from './hooks/useNow';
import TemptationMain from './pages/TemptationMain';
import { Search } from './pages/Search';
import { useWishlistContext } from './hooks/WishlistContext';

export default function Temptation() {
  const navigate = useNavigate()
  const { keyword, setKeyword, filteredProducts } = useWishlistContext();
  useNow();

  const trimmedKeyword = keyword.trim();

  return (
    <>
      <Header
        left={
          <button type="button" aria-label="로고">Logo</button>
        }
        onBellClick={() => navigate('/notification')}
        subLeft={<HeaderBackButton />}
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
        <TemptationMain />
      )}
    </>
  )
}