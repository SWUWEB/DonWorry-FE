import { describe, expect, it } from 'vitest'
import { formatDateCompact, formatDateKorean } from './date'

describe('formatDateKorean / formatDateCompact', () => {
  it('자정 근처 UTC 시각도 KST 기준 날짜로 표시한다 (실행 환경의 로컬 시간대와 무관하게)', () => {
    // 2026-08-09T00:30:00.000Z는 KST(UTC+9)로 2026-08-09 09:30이므로 8월 9일이어야 합니다.
    // 로컬 Date getter를 썼다면 UTC-10 이상 서쪽 시간대에서 8월 8일로 잘못 표시됩니다.
    expect(formatDateKorean('2026-08-09T00:30:00.000Z')).toBe('2026년 8월 9일')
    expect(formatDateCompact('2026-08-09T00:30:00.000Z')).toBe('2026.08.09')
  })

  it('KST 자정 이전 UTC 시각은 하루 전 날짜로 표시한다', () => {
    // 2026-08-08T14:30:00.000Z는 KST로 2026-08-08 23:30이므로 8월 8일이어야 합니다.
    expect(formatDateKorean('2026-08-08T14:30:00.000Z')).toBe('2026년 8월 8일')
    expect(formatDateCompact('2026-08-08T14:30:00.000Z')).toBe('2026.08.08')
  })

  it('한 자리 월/일을 두 자리로 패딩한다', () => {
    expect(formatDateCompact('2026-04-05T03:00:00.000Z')).toBe('2026.04.05')
  })
})
