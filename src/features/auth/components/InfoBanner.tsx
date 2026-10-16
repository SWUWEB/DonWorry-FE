interface InfoBannerProps {
  message: string
}

export default function InfoBanner({ message }: InfoBannerProps) {
  return (
    <p
      role="status"
      className="m-0 rounded-xl border border-main-200 bg-main-000 px-3.5 py-3 text-[13px] leading-relaxed font-medium text-main-600"
    >
      {message}
    </p>
  )
}
