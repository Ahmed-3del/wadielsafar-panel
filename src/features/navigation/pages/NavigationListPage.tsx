import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Card } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useNavItems } from '../hooks/useNavItems'
import { useDeleteNavItem } from '../hooks/useDeleteNavItem'
import { NAV_GROUPS, type NavItem } from '../types'

export function NavigationListPage() {
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<NavItem | null>(null)
  const { data, isLoading, isError, error, refetch } = useNavItems()
  const deleteNavItem = useDeleteNavItem()

  const columns: DataTableColumn<NavItem>[] = [
    { key: 'order', header: 'Order', render: (row) => row.order },
    { key: 'label_en', header: 'Label (EN)', render: (row) => row.label_en },
    { key: 'label_ar', header: 'Label (AR)', render: (row) => row.label_ar },
    {
      key: 'href',
      header: 'Path',
      render: (row) => <code className="text-xs text-stone-600">{row.href}</code>,
    },
    {
      key: 'group',
      header: 'Shown in',
      render: (row) => NAV_GROUPS.find((g) => g.value === row.group)?.label ?? row.group,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.is_active ? 'success' : 'neutral'}>
          {row.is_active ? 'Visible' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-3">
          <Link to={`/navigation/${row.id}/edit`} className="text-navy-700 hover:underline">
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
    deleteNavItem.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Link deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Navigation</h1>
        <Button
          onClick={() => {
            void navigate('/navigation/new')
          }}
        >
          New Link
        </Button>
      </div>

      <Card>
        <p className="text-sm text-stone-600">
          Reorder with the order number, hide a link by switching it off, or add one of your own.
          If every link here were removed the site would fall back to the navigation it shipped
          with, rather than render a header with nothing in it.
        </p>
      </Card>

      <DataTable
        columns={columns}
        data={data}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error ? extractErrorMessage(error) : undefined}
        onRetry={() => {
          void refetch()
        }}
        emptyTitle="No links"
        emptyDescription="The site is showing the navigation it shipped with."
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this link?"
        description="It disappears from the site immediately. To take it down temporarily, switch it to hidden instead."
        confirmLabel="Delete"
        isConfirming={deleteNavItem.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
