export interface LoginRedirectState {
  from?: string
  notice?: string
}

export function getLoginRedirectPath(state: unknown): string {
  if (!state || typeof state !== 'object') return '/'

  const from = (state as LoginRedirectState).from
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) return '/'
  if (from.split(/[?#]/, 1)[0] === '/login') return '/'

  return from
}

export function getLoginNotice(state: unknown): string {
  if (!state || typeof state !== 'object') return ''
  const notice = (state as LoginRedirectState).notice
  return typeof notice === 'string' ? notice : ''
}
