import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { NavItemForm } from '../components/NavItemForm'
import { useNavItem } from '../hooks/useNavItem'
import { useSaveNavItem } from '../hooks/useSaveNavItem'
import type { NavItemFormValues } from '../schemas/navItemSchema'

export function NavItemFormPage() {
  const { id } = useParams<{ id: string }>()
  const navItemId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: navItem, isLoading, isError, error, refetch } = useNavItem(navItemId)
  const saveNavItem = useSaveNavItem(navItemId)

  if (navItemId && isLoading) return <Spinner label="Loading link…" />
  if (navItemId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Link not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: NavItemFormValues) => {
    saveNavItem.mutate(values, {
      onSuccess: () => {
        showToast(navItemId ? 'Link updated.' : 'Link added.')
        void navigate('/navigation')
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {navItemId ? 'Edit Link' : 'New Link'}
      </h1>
      <Card>
        <NavItemForm
          initialValues={navItem}
          isSubmitting={saveNavItem.isPending}
          submitLabel={navItemId ? 'Save changes' : 'Add link'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
