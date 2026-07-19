const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

export function getFormattedDateLabel(date: Date = new Date()): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = DAYS[date.getDay()]
  return `${month}월 ${day}일 ${dayOfWeek}요일`
}
