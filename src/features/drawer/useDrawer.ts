import { useContext } from 'react'
import { DrawerContext } from './drawer-context'

export function useDrawer() {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider')
  return ctx
}
