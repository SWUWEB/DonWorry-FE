const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

export function getFormattedDateLabel(date: Date = new Date()): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = DAYS[date.getDay()]
  return `${month}월 ${day}일 ${dayOfWeek}요일`
}

export function getDayIndex(length: number, date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 1)
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / 86400000)
  return dayOfYear % length
}
