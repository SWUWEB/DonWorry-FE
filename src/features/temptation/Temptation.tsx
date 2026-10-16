import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import SearchBar from './components/SearchBar'
import styles from './Temptation.module.css'
import { useNow } from './hooks/useNow'
import TemptationMain from './pages/TemptationMain'
import { Search } from './pages/Search'
import { useWishlistContext } from './hooks/WishlistContext'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'

export default function Temptation() {
  const navigate = useNavigate()
  const { keyword, setKeyword, filteredProducts, isUnauthorized } = useWishlistContext()
  useNow()

  const handleAuthErrorConfirm = () => {
    navigate('/login')
  }

  const trimmedKeyword = keyword.trim()

  return (
    <>
      <Header
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

      <ConfirmDialog
        isOpen={isUnauthorized}
        title="로그인이 필요합니다"
        description="세션이 만료되었거나 로그인 정보가 없습니다."
        onlyConfirm
        confirmText="로그인하러 가기"
        onCancel={handleAuthErrorConfirm}
        onConfirm={handleAuthErrorConfirm}
      />
    </>
  )
}
