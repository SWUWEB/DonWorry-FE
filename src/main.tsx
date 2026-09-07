import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/api/queryClient'
import router from '@/router'
import { DrawerProvider } from '@/features/drawer/DrawerProvider'
import './index.css'

const queryClient = createQueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DrawerProvider>
        <RouterProvider router={router} />
      </DrawerProvider>
    </QueryClientProvider>
  </StrictMode>,
)
