import { beforeEach, describe, expect, it, vi } from 'vitest'
import client from './client'
import { requestLoginIdRecovery } from './auth'

vi.mock('./client', () => ({ default: { post: vi.fn() } }))

describe('아이디 찾기 API', () => {
  beforeEach(() => vi.clearAllMocks())
  it('가입 이메일을 보내고 재전송 대기 시간을 반환한다', async () => {
    const response = { success: true, message: 'OK', data: { resendCooldownSeconds: 60 } }
    vi.mocked(client.post).mockResolvedValueOnce({ data: response })
    await expect(requestLoginIdRecovery({ email: 'tester@example.com' })).resolves.toEqual(response)
    expect(client.post).toHaveBeenCalledWith('/api/v1/auth/login-id-recovery/request', {
      email: 'tester@example.com',
    })
  })
  it('요청 실패를 성공으로 처리하지 않는다', async () => {
    vi.mocked(client.post).mockRejectedValueOnce(new Error('network'))
    await expect(requestLoginIdRecovery({ email: 'tester@example.com' })).rejects.toThrow('network')
  })
})
