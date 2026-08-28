import { Link } from 'react-router-dom'
import { Badge, Card } from '@/components/ui'
import { Spinner, ErrorState } from '@/components/feedback'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { InquiryStatusBadge } from '@/features/inquiries/components/InquiryStatusBadge'
import { extractErrorMessage } from '@/services/api/client'
import { formatDateTime } from '@/utils/formatDate'
import { useDashboardStats } from '../hooks/useDashboardStats'
import type { RecentInquiry } from '../types'

const CONTENT_LABELS: Record<string, string> = {
  destinations: 'Destinations',
  packages: 'Packages',
  hotels: 'Hotels',
  flights: 'Flight Deals',
  visas: 'Visa Types',
  offers: 'Offers',
  testimonials: 'Testimonials',
}

const recentColumns: DataTableColumn<RecentInquiry>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <Link to={`/inquiries/${row.id}`} className="font-medium text-navy-700 hover:underline">
        {row.name}
      </Link>
    ),
  },
  { key: 'service_type', header: 'Service', render: (row) => row.service_type },
  { key: 'status', header: 'Status', render: (row) => <InquiryStatusBadge status={row.status} /> },
  { key: 'created_at', header: 'Received', render: (row) => formatDateTime(row.created_at) },
]

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-navy-900">{value}</p>
    </Card>
  )
}

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats()

  if (isLoading) return <Spinner label="Loading dashboard…" />
  if (isError || !data) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Could not load dashboard statistics.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const { inquiries, content, testimonials } = data

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-navy-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total Inquiries" value={inquiries.total} />
        <StatCard label="New Inquiries" value={inquiries.new} />
        {/* Pending approvals are an action item, so this tile links straight to the queue. */}
        <Link to="/testimonials?is_approved=false" className="block">
          <Card className="h-full transition-colors hover:border-navy-300">
            <p className="text-sm text-stone-500">Testimonials Pending Approval</p>
            <p className="mt-1 text-2xl font-semibold text-navy-900">
              {testimonials.pending_approval}
            </p>
            <p className="mt-1 text-xs font-medium text-navy-700">Review queue →</p>
          </Card>
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-navy-900">Inquiries by status</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(inquiries.by_status).map(([status, count]) => (
            <Card key={status} className="min-w-32 flex-1">
              <Badge tone="neutral">{status}</Badge>
              <p className="mt-2 text-xl font-semibold text-navy-900">{count}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-navy-900">Content</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {Object.entries(content).map(([key, count]) => (
            <StatCard key={key} label={CONTENT_LABELS[key] ?? key} value={count} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-navy-900">Recent inquiries</h2>
        <DataTable
          columns={recentColumns}
          data={inquiries.recent}
          getRowKey={(row) => row.id}
          emptyTitle="No inquiries yet"
        />
      </section>
    </div>
  )
}
