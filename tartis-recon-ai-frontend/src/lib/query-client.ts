import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
})
