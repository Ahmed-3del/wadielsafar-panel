import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { usePromotions } from '../hooks/usePromotions'
import { useDeletePromotion } from '../hooks/useDeletePromotion'
import { formatDateTime } from '@/utils/formatDate'
import type { Promotion } from '../types'

export function PromotionsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Promotion | null>(null)
  const { data, isLoading, isError, error, refetch } = usePromotions(page)
  const remove = useDeletePromotion()

  const columns: DataTableColumn<Promotion>[] = [
    { key: 'title_en', header: 'Title', render: (row) => row.title_en },
    { key: 'badge_en', header: 'Figure', render: (row) => row.badge_en || '—' },
    {
      key: 'code',
      header: 'Code',
      render: (row) => (row.code ? <span dir="ltr">{row.code}</span> : '—'),
    },
    {
      key: 'ends_at',
      header: 'Ends',
      render: (row) => {
        const expired = row.ends_at ? new Date(row.ends_at).getTime() <= Date.now() : false
        return (
          <span className={expired ? 'text-red-600' : undefined}>
            {formatDateTime(row.ends_at)}
            {/* An expired promotion is already gone from the website; saying so
                here is what stops someone hunting for why. */}
            {expired ? ' (over)' : ''}
          </span>
        )
      },
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
          <Link to={`/promotions/${row.id}/edit`} className="text-navy-700 hover:underline">
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
        showToast('Promotion deleted.')
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
          <h1 className="text-xl font-semibold text-navy-900">Promotions</h1>
          <p className="mt-1 text-sm text-stone-500">
            The &ldquo;ways to save&rdquo; cards on the homepage. Every figure here is a public
            commitment — a percentage, a code, a deadline the site counts down to.
          </p>
        </div>
        <Button
          onClick={() => {
            void navigate('/promotions/new')
          }}
        >
          New Promotion
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
        emptyTitle="No promotions yet"
        emptyDescription="Add one and the savings row appears on the homepage. With none, the whole section is skipped."
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
        title="Delete this promotion?"
        description="The card disappears from the homepage immediately. To take it down for now, switch it to inactive instead."
        confirmLabel="Delete"
        isConfirming={remove.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
