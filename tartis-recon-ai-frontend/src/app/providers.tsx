import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { queryClient } from '@/lib/query-client'
import { router } from './router'
import { ToastContainer } from './components/ToastContainer'
import { useSseNotifications } from '@/lib/use-sse'

function AppContent() {
  useSseNotifications('/v1/events')

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
