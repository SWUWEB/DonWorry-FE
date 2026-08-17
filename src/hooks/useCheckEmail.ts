import { useMutation } from '@tanstack/react-query'
import { checkEmail } from '@/api/auth'

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: checkEmail,
  })
}
