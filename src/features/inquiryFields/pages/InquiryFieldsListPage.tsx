import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Select } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { SERVICE_TYPES } from '@/features/inquiries/types'
import { useInquiryFields } from '../hooks/useInquiryFields'
import { useDeleteInquiryField } from '../hooks/useDeleteInquiryField'
import { INQUIRY_FIELD_TYPES, type InquiryField } from '../types'

const TYPE_LABELS = Object.fromEntries(INQUIRY_FIELD_TYPES.map((t) => [t.value, t.label]))

export function InquiryFieldsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [serviceType, setServiceType] = useState('')
  const [pendingDelete, setPendingDelete] = useState<InquiryField | null>(null)
  const { data, isLoading, isError, error, refetch } = useInquiryFields(page, serviceType)
  const remove = useDeleteInquiryField()

  const columns: DataTableColumn<InquiryField>[] = [
    { key: 'service_type', header: 'Service', render: (row) => row.service_type },
    { key: 'label_en', header: 'Question', render: (row) => row.label_en },
    { key: 'key', header: 'Answer key', render: (row) => <span dir="ltr">{row.key}</span> },
    {
      key: 'field_type',
      header: 'Type',
      render: (row) => (
        <span>
          {TYPE_LABELS[row.field_type] ?? row.field_type}
          {row.options.length > 0 ? ` (${row.options.length})` : ''}
        </span>
      ),
    },
    {
      key: 'is_required',
      header: 'Required',
      render: (row) => (row.is_required ? <Badge tone="success">Yes</Badge> : '—'),
    },
    { key: 'order', header: 'Order', render: (row) => row.order },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.is_active ? 'success' : 'neutral'}>
          {row.is_active ? 'Active' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-3">
          <Link to={`/contact-fields/${row.id}/edit`} className="text-navy-700 hover:underline">
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
        showToast('Question deleted.')
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
          <h1 className="text-xl font-semibold text-navy-900">Contact form questions</h1>
          <p className="mt-1 text-sm text-stone-500">
            What the website asks once a visitor picks a service. Name, email, phone and message are
            always asked; everything here is on top of those.
          </p>
        </div>
        <Button
          onClick={() => {
            void navigate('/contact-fields/new')
          }}
        >
          New Question
        </Button>
      </div>

      <Select
        aria-label="Filter by service"
        value={serviceType}
        onChange={(event) => {
          setServiceType(event.target.value)
          setPage(1)
        }}
      >
        <option value="">All services</option>
        {SERVICE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </option>
        ))}
      </Select>

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
        emptyTitle="No questions for this service"
        emptyDescription="The contact form still asks the name, email, phone and message — add a question to ask for more."
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
        title="Delete this question?"
        description="The website stops asking it immediately. Enquiries already received keep the answers they carry. To stop asking without deleting, switch it to inactive."
        confirmLabel="Delete"
        isConfirming={remove.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
