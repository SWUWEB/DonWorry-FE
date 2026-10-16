const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

export function getFormattedDateLabel(date: Date = new Date()): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = DAYS[date.getDay()]
  return `${month}월 ${day}일 ${dayOfWeek}요일`
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

const KST_YEAR_MONTH_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
})

// "YYYY-MM" 형식의 서울 기준 현재 연월을 반환합니다. (예산 조회 등 month 파라미터에 사용)
// format()의 출력 형식은 실행 환경 locale 데이터에 좌우될 수 있어, formatToParts로 직접 조합합니다.
export function getCurrentYearMonth(): string {
  const parts = KST_YEAR_MONTH_FORMATTER.formatToParts(new Date())
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}`
}

// "YYYY-MM" 문자열을 delta개월만큼 이동시킵니다. (월 선택 이전/다음 이동에 사용)
export function shiftYearMonth(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 + delta, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}
