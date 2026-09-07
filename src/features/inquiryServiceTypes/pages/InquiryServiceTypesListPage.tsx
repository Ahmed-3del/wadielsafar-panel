import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useInquiryServiceTypes } from '../hooks/useInquiryServiceTypes'
import { useDeleteInquiryServiceType } from '../hooks/useDeleteInquiryServiceType'
import type { InquiryServiceType } from '../types'

export function InquiryServiceTypesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<InquiryServiceType | null>(null)
  const { data, isLoading, isError, error, refetch } = useInquiryServiceTypes(page)
  const remove = useDeleteInquiryServiceType()

  const columns: DataTableColumn<InquiryServiceType>[] = [
    { key: 'order', header: 'Order', render: (row) => row.order },
    { key: 'label_en', header: 'Shown as (English)', render: (row) => row.label_en },
    {
      key: 'label_ar',
      header: 'Shown as (Arabic)',
      render: (row) => <span dir="rtl">{row.label_ar}</span>,
    },
    {
      key: 'value',
      header: 'Files under',
      render: (row) => <span dir="ltr">{row.value}</span>,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.is_active ? 'success' : 'neutral'}>
          {row.is_active ? 'Offered' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-3">
          <Link to={`/contact-services/${row.id}/edit`} className="text-navy-700 hover:underline">
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

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    remove.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Service removed from the form.')
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
        <div>
          <h1 className="text-xl font-semibold text-navy-900">Contact form services</h1>
          <p className="mt-1 text-sm text-stone-500">
            The "Service needed" list on the website's contact form — its wording, its order, and
            what is offered at all. The questions each service then asks live under Contact form
            questions.
          </p>
        </div>
        <Button
          onClick={() => {
            void navigate('/contact-services/new')
          }}
        >
          New Service
        </Button>
      </div>

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
        emptyTitle="No services on the form"
        emptyDescription="With none here the website falls back to the built-in six, so visitors can still send an enquiry."
      />

      {data && data.results.length > 0 && (
        <div className="flex items-center justify-between text-sm text-stone-500">
          <span>{data.count} total</span>
          <div className="flex gap-2">
            <Button variant="ghost" disabled={!data.previous} onClick={() => { setPage((c) => c - 1) }}>
              Previous
            </Button>
            <Button variant="ghost" disabled={!data.next} onClick={() => { setPage((c) => c + 1) }}>
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove this service from the form?"
        description="Visitors stop being offered it immediately. Enquiries already filed under it keep their service and stay in the list. To stop offering it without deleting, switch it to hidden instead."
        confirmLabel="Delete"
        isConfirming={remove.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
