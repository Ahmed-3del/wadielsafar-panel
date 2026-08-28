import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/authentication'
import { Toaster } from '@/components/feedback'
import { queryClient } from '../config/queryClient'
import { AppRouter } from '../router/AppRouter'

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
