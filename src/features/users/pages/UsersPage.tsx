import { ComingSoonPage } from '@/components/feedback'
import { useUsersList } from '../hooks/useUsersList'

export function UsersPage() {
  const { data, isLoading, isError, refetch } = useUsersList()

  return (
    <ComingSoonPage
      title="Users"
      description="Admin panel user accounts."
      isLoading={isLoading}
      isError={isError}
      count={data?.count}
      onRetry={() => {
        void refetch()
      }}
    />
  )
}
