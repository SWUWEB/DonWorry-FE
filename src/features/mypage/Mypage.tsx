import styles from './MyPage.module.css'
import ProfileCard from './components/ProfileCard'
import BudgetCard from './components/BudgetCard'
import MenuSection from './components/MenuSection'
import { useNavigate } from 'react-router-dom'
import HeaderBackButton from '@/shared/components/HeaderBackButton'
import { getCurrentYearMonth } from '@/shared/utils/date'
import { useBudget, useMe } from './hooks/useUser'

export default function MyPage() {
  const navigate = useNavigate()
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useMe()
  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
  } = useBudget(getCurrentYearMonth())

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.backButton}>
          <HeaderBackButton onClick={() => navigate('/')} />
        </div>

        <h1 className={styles.title}>마이페이지</h1>
      </header>

      <ProfileCard
        name={
          isProfileLoading
            ? '불러오는 중...'
            : isProfileError
              ? '회원 정보 조회 실패'
              : profile
                ? `${profile.nickname}님`
                : '회원님'
        }
        subtitle={profile?.email ?? profile?.phoneNumber ?? undefined}
        profileImageUrl={profile?.profileImageUrl}
      />

      <BudgetCard
        remainingAmount={budget?.remainingAmount ?? null}
        usageRate={budget?.usageRate ?? null}
        isLoading={isBudgetLoading}
        isError={isBudgetError}
      />
      <MenuSection />
    </main>
  )
}
