import { isAxiosError } from 'axios'

export type WishlistErrorKind = 'EMPTY' | 'FORBIDDEN' | 'NOT_FOUND' | 'ALREADY_DECIDED' | 'UNKNOWN'

const ERROR_CODE_MAP: Record<string, WishlistErrorKind> = {
  WISH4001: 'EMPTY',
  WISH4031: 'FORBIDDEN',
  WISH4041: 'NOT_FOUND',
  WISH4091: 'ALREADY_DECIDED',
}

export const getWishlistErrorKind = (error: unknown): WishlistErrorKind | null => {
  if (!isAxiosError(error) || !error.response) return null
  const code = error.response.data?.code
  return ERROR_CODE_MAP[code] ?? null
}

export const getMutationErrorKind = (error: unknown): WishlistErrorKind | null => {
  if (
    error instanceof Error &&
    ['EMPTY', 'FORBIDDEN', 'NOT_FOUND', 'ALREADY_DECIDED'].includes(error.message)
  ) {
    return error.message as WishlistErrorKind
  }
  return null
}
