import { createContext } from 'react'

export interface DrawerContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const DrawerContext = createContext<DrawerContextValue | null>(null)
