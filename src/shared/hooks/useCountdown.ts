import { useEffect, useRef, useState } from 'react'

export function useCountdown() {
  const deadline = useRef(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const running = remainingSeconds > 0

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const start = (seconds: number) => {
    const duration = Number.isFinite(seconds) ? Math.max(0, Math.ceil(seconds)) : 0
    deadline.current = Date.now() + duration * 1000
    setRemainingSeconds(duration)
  }

  return { remainingSeconds, start }
}
