import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import logo from '@/assets/logos/donworry_simple_logo.svg'

interface AuthPageHeaderProps {
  title: string
  description: string
}

export default function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className="mt-12 flex w-full max-w-89.5 flex-col items-start">
      <img src={logo} alt="DonWorry" className="mb-5 h-7 w-auto rounded-[10px]" />

      <Link
        to="/login"
        className="mb-4 flex items-center gap-1 text-sm font-medium text-main-500 no-underline"
      >
        <IoArrowBack size={16} />
        로그인으로 돌아가기
      </Link>

      <h1 className="m-0 text-2xl leading-none font-semibold text-text-primary">{title}</h1>
      <p className="mt-3 text-[15px] leading-snug text-gray-300">{description}</p>
    </div>
  )
}
