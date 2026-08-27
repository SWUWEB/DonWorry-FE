import { useMutation } from '@tanstack/react-query'
import { checkLoginId } from '@/api/auth'

export const useCheckLoginId = () => {
  return useMutation({
    mutationFn: checkLoginId,
  })
}
