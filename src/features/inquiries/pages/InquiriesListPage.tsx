import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { extractErrorMessage } from '@/services/api/client'
import { formatDate } from '@/utils/formatDate'
import { InquiryFiltersBar } from '../components/InquiryFiltersBar'
import { InquiryStatusBadge } from '../components/InquiryStatusBadge'
import { useInquiries } from '../hooks/useInquiries'
import type { Inquiry, InquiryFilters } from '../types'

const columns: DataTableColumn<Inquiry>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <Link to={`/inquiries/${row.id}`} className="font-medium text-navy-700 hover:underline">
        {row.name}
      </Link>
    ),
  },
  { key: 'email', header: 'Email', render: (row) => row.email },
  { key: 'service_type', header: 'Service', render: (row) => row.service_type },
  { key: 'status', header: 'Status', render: (row) => <InquiryStatusBadge status={row.status} /> },
  {
    key: 'created_at',
    header: 'Received',
    render: (row) => formatDate(row.created_at),
  },
]

export function InquiriesListPage() {
  const [filters, setFilters] = useState<InquiryFilters>({})
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error, refetch } = useInquiries(filters, page)

  const handleFiltersChange = (next: InquiryFilters) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">Inquiries</h1>
      <InquiryFiltersBar filters={filters} onChange={handleFiltersChange} />
      <DataTable
        columns={columns}
        data={data?.results}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error ? extractErrorMessage(error) : undefined}
        onRetry={() => {
          void refetch()
        }}
        emptyTitle="No inquiries match these filters"
      />
      {data && data.results.length > 0 && (
        <div className="flex items-center justify-between text-sm text-stone-500">
          <span>{data.count} total</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={!data.previous}
              onClick={() => {
                setPage((current) => current - 1)
              }}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={!data.next}
              onClick={() => {
                setPage((current) => current + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
