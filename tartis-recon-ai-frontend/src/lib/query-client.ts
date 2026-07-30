import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      gcTime: 10 * 60 * 1000,
      // Sin polling por staleTime/refetchOnWindowFocus: la frescura la gestiona
      // el SSE (useRealtimeSync) invalidando las queries afectadas.
      refetchOnWindowFocus: false,
    },
  },
})
