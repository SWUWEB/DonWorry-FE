import { Link } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import AuthPageHeader from './components/AuthPageHeader'
import InfoBanner from './components/InfoBanner'

// TODO(BE 연동): OpenAPI에 아이디 찾기 endpoint가 추가되면 이메일 입력·발송 흐름을 연결합니다.
// 현재는 실제 요청 없이 성공한 것처럼 보이지 않도록 준비 중 안내만 표시합니다.
export default function FindId() {
  return (
    <AuthLayout
      header={
        <AuthPageHeader title="아이디 찾기" description="가입한 이메일로 아이디를 전송해드려요." />
      }
    >
      <InfoBanner message="현재 아이디 찾기 기능은 준비 중입니다. 서버 API가 제공되면 바로 이용할 수 있어요." />

      <p className="m-0 mt-1 text-center text-sm text-text-primary">
        비밀번호를 잊으셨나요?{' '}
        <Link to="/reset-password" className="font-semibold text-main-500 no-underline">
          비밀번호 재설정
        </Link>
      </p>
    </AuthLayout>
  )
}
