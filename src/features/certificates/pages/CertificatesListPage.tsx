import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useCertificates } from '../hooks/useCertificates'
import { useDeleteCertificate } from '../hooks/useDeleteCertificate'
import type { Certificate } from '../types'

export function CertificatesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Certificate | null>(null)
  const { data, isLoading, isError, error, refetch } = useCertificates(page)
  const remove = useDeleteCertificate()

  const columns: DataTableColumn<Certificate>[] = [
    {
      key: 'image',
      header: 'Badge',
      render: (row) =>
        row.image ? (
          <img src={row.image} alt="" className="h-8 w-auto max-w-24 object-contain" />
        ) : (
          <span className="text-stone-400">—</span>
        ),
    },
    { key: 'name_en', header: 'Name', render: (row) => row.name_en },
    { key: 'issuer_en', header: 'Issued by', render: (row) => row.issuer_en || '—' },
    {
      key: 'document',
      header: 'Document',
      render: (row) =>
        row.document ? (
          <a
            href={row.document}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-700 hover:underline"
          >
            Open
          </a>
        ) : (
          <span className="text-stone-400">—</span>
        ),
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
          <Link to={`/certificates/${row.id}/edit`} className="text-navy-700 hover:underline">
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
        showToast('Certificate deleted.')
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
          <h1 className="text-xl font-semibold text-navy-900">Certificates</h1>
          <p className="mt-1 text-sm text-stone-500">The licences shown in the website footer, and the documents behind them.</p>
        </div>
        <Button
          onClick={() => {
            void navigate('/certificates/new')
          }}
        >
          New Certificate
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
        emptyTitle="No certificates yet"
        emptyDescription="Add a licence with its badge and its PDF, and it appears in the footer."
      />

      {data && data.results.length > 0 && (
        <div className="flex items-center justify-between text-sm text-stone-500">
          <span>{data.count} total</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={!data.previous}
              onClick={() => { setPage((current) => current - 1) }}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={!data.next}
              onClick={() => { setPage((current) => current + 1) }}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this certificate?"
        description="It disappears from the footer immediately. To hide it temporarily, switch it to inactive instead."
        confirmLabel="Delete"
        isConfirming={remove.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
