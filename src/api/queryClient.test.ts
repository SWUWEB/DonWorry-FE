import { describe, expect, it } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { shouldRetryRequest } from './queryClient'

function axiosErrorWith(status: number) {
  return new AxiosError('failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    data: {},
    headers: {},
    config: { headers: new AxiosHeaders() },
  })
}

describe('shouldRetryRequest', () => {
  it.each([400, 401, 403, 404, 409, 429])('%d는 재시도하지 않는다', (status) => {
    expect(shouldRetryRequest(0, axiosErrorWith(status))).toBe(false)
  })

  it.each([500, 502, 503])('%d는 재시도한다', (status) => {
    expect(shouldRetryRequest(0, axiosErrorWith(status))).toBe(true)
  })

  it('네트워크 오류처럼 응답이 없는 경우에도 재시도한다', () => {
    expect(shouldRetryRequest(0, new AxiosError('Network Error'))).toBe(true)
  })

  it('3회까지만 재시도한다', () => {
    const error = new AxiosError('Network Error')

    expect(shouldRetryRequest(2, error)).toBe(true)
    expect(shouldRetryRequest(3, error)).toBe(false)
  })

  it('axios 오류가 아니어도 재시도 횟수를 지킨다', () => {
    expect(shouldRetryRequest(0, new Error('boom'))).toBe(true)
    expect(shouldRetryRequest(3, new Error('boom'))).toBe(false)
  })
})
