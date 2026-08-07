export const formatRemainingTime = (time: Date): string => {
  const diffMs = time.getTime() - Date.now()
  if (diffMs <= 0) return '00:00'

  const totalMinutes = Math.floor(diffMs / 1000 / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}`
}
