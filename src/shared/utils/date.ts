const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

export function getFormattedDateLabel(date: Date = new Date()): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = DAYS[date.getDay()]
  return `${month}월 ${day}일 ${dayOfWeek}요일`
}

export function getDayIndex(length: number): number {
  const now = new Date()
  const start = Date.UTC(now.getUTCFullYear(), 0, 1)
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const dayOfYear = Math.floor((today - start) / 86400000)
  return dayOfYear % length
}
