import { describe, expect, it } from 'vitest'
import { getLoginRedirectPath } from './redirect'

describe('getLoginRedirectPath', () => {
  it('보호 화면의 쿼리와 해시를 포함한 내부 경로를 반환한다', () => {
    expect(getLoginRedirectPath({ from: '/record/1?edit=true#price' })).toBe(
      '/record/1?edit=true#price',
    )
  })

  it.each([
    undefined,
    {},
    { from: 'https://example.com' },
    { from: '//example.com' },
    { from: '/login' },
  ])('유효하지 않은 state %j에는 홈 경로를 반환한다', (state) => {
    expect(getLoginRedirectPath(state)).toBe('/')
  })
})
