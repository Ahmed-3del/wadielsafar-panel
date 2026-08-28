import { ComingSoonPage } from '@/components/feedback'
import { useBookingsList } from '../hooks/useBookingsList'

export function BookingsPage() {
  const { data, isLoading, isError, refetch } = useBookingsList()

  return (
    <ComingSoonPage
      title="Bookings"
      description="Customer bookings across all service types."
      isLoading={isLoading}
      isError={isError}
      count={data?.count}
      onRetry={() => {
        void refetch()
      }}
    />
  )
}
