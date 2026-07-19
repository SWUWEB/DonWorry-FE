import { useEffect, useRef, useState } from 'react'
import styles from './CountdownTimer.module.css'

interface CountdownTimerProps {
  durationSeconds: number
  onComplete?: () => void
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function CountdownTimer({ durationSeconds, onComplete }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (remaining === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete?.()
    }
  }, [remaining, onComplete])

  return (
    <p className={styles.time} aria-live="polite">
      {formatTime(remaining)}
    </p>
  )
}
