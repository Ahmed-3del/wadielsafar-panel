import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { TestimonialFiltersBar } from '../components/TestimonialFiltersBar'
import { useTestimonials } from '../hooks/useTestimonials'
import { useApproveTestimonial } from '../hooks/useApproveTestimonial'
import { useDeleteTestimonial } from '../hooks/useDeleteTestimonial'
import type { Testimonial, TestimonialFilters } from '../types'

export function TestimonialsListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Testimonial | null>(null)
  // The approval filter lives in the URL so the dashboard's pending-approval tile can deep-link
  // straight into the moderation queue.
  const approvalParam = searchParams.get('is_approved')
  const filters: TestimonialFilters =
    approvalParam === 'true' || approvalParam === 'false' ? { is_approved: approvalParam } : {}
  const { data, isLoading, isError, error, refetch } = useTestimonials(filters, page)
  const approveTestimonial = useApproveTestimonial()
  const deleteTestimonial = useDeleteTestimonial()

  const columns: DataTableColumn<Testimonial>[] = [
    { key: 'customer_name', header: 'Customer', render: (row) => row.customer_name },
    { key: 'rating', header: 'Rating', render: (row) => '★'.repeat(row.rating) },
    { key: 'service_type', header: 'Service', render: (row) => row.service_type ?? '—' },
    {
      key: 'is_approved',
      header: 'Approval',
      render: (row) => (
        <Badge tone={row.is_approved ? 'success' : 'warning'}>
          {row.is_approved ? 'Approved' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'is_visible',
      header: 'Visible',
      render: (row) => (row.is_visible ? 'Yes' : 'No'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-3">
          {!row.is_approved && (
            <button
              type="button"
              className="text-emerald-700 hover:underline disabled:opacity-50"
              disabled={approveTestimonial.isPending}
              onClick={() => {
                approveTestimonial.mutate(row.id)
              }}
            >
              Approve
            </button>
          )}
          <Link to={`/testimonials/${row.id}/edit`} className="text-navy-700 hover:underline">
            Edit
          </Link>
          <button
            type="button"
            className="text-red-600 hover:underline"
            onClick={() => {
              setPendingDelete(row)
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const handleFiltersChange = (next: TestimonialFilters) => {
    setSearchParams(next.is_approved ? { is_approved: next.is_approved } : {})
    setPage(1)
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteTestimonial.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Testimonial deleted.')
        setPendingDelete(null)
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy-900">Testimonials</h1>
        <Button
          onClick={() => {
            void navigate('/testimonials/new')
          }}
        >
          New Testimonial
        </Button>
      </div>
      <TestimonialFiltersBar filters={filters} onChange={handleFiltersChange} />
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
        emptyTitle="No testimonials match these filters"
        emptyDescription="Nothing to moderate right now."
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
      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete the testimonial from ${pendingDelete?.customer_name ?? ''}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        isConfirming={deleteTestimonial.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
