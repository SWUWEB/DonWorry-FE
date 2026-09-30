import { useMutation } from '@tanstack/react-query'
import { requestLoginIdRecovery } from '@/api/auth'

export function useLoginIdRecovery() {
  return useMutation({ mutationFn: requestLoginIdRecovery })
}
