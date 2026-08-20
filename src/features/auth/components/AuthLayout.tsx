import type { ReactNode } from 'react'

interface AuthLayoutProps {
  header: ReactNode
  children: ReactNode
}

export default function AuthLayout({ header, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f5f7f6] px-4">
      <div className="flex w-full max-w-97.5 flex-col items-center">
        {header}

        <section className="mt-6 flex w-full max-w-89.5 flex-col gap-5 rounded-[20px] bg-text-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          {children}
        </section>
      </div>
    </main>
  )
}
