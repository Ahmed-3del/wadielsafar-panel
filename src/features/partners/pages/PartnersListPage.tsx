import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { usePartners } from '../hooks/usePartners'
import { useDeletePartner } from '../hooks/useDeletePartner'
import type { Partner } from '../types'

export function PartnersListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Partner | null>(null)
  const { data, isLoading, isError, error, refetch } = usePartners(page)
  const deletePartner = useDeletePartner()

  const columns: DataTableColumn<Partner>[] = [
    {
      key: 'logo',
      header: 'Logo',
      // The logo is the whole point of the row, so it is the first thing in it.
      render: (row) =>
        row.logo ? (
          <img src={row.logo} alt="" className="h-8 w-auto max-w-24 object-contain" />
        ) : (
          <span className="text-stone-400">—</span>
        ),
    },
    { key: 'name_en', header: 'Name (EN)', render: (row) => row.name_en },
    { key: 'name_ar', header: 'Name (AR)', render: (row) => row.name_ar },
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
          <Link to={`/partners/${row.id}/edit`} className="text-navy-700 hover:underline">
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
    deletePartner.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Partner deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Partners</h1>
        <Button
          onClick={() => {
            void navigate('/partners/new')
          }}
        >
          New Partner
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
        emptyTitle="No partners yet"
        emptyDescription="Add the airlines, hotel groups and authorities the company works with."
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
        title="Delete this partner?"
        description="It will disappear from the site immediately. To hide it temporarily, switch it to inactive instead."
        confirmLabel="Delete"
        isConfirming={deletePartner.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
