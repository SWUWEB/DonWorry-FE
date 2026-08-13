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

// 서버 응답(occurredAt)은 KST 기준 날짜 계약이므로, 브라우저 로컬 시간대와 무관하게
// 항상 Asia/Seoul 기준으로 날짜를 뽑아냅니다.
const KST_DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

function getKstDateParts(isoDate: string) {
  const parts = KST_DATE_FORMATTER.formatToParts(new Date(isoDate))
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return { year: get('year'), month: get('month'), day: get('day') }
}

export function formatDateKorean(isoDate: string): string {
  const { year, month, day } = getKstDateParts(isoDate)
  return `${year}년 ${month}월 ${day}일`
}

export function formatDateCompact(isoDate: string): string {
  const { year, month, day } = getKstDateParts(isoDate)
  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`
}
