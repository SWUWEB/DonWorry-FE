import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

interface DrawerContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const DrawerContext = createContext<DrawerContextValue | null>(null)

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <DrawerContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </DrawerContext.Provider>
  )
}
