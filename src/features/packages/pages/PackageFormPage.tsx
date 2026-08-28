import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { PackageForm } from '../components/PackageForm'
import { usePackage } from '../hooks/usePackage'
import { useSavePackage } from '../hooks/useSavePackage'
import type { PackageFormValues } from '../schemas/packageSchema'

export function PackageFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: pkg, isLoading, isError, error, refetch } = usePackage(slug)
  const savePackage = useSavePackage(slug)

  if (slug && isLoading) return <Spinner label="Loading package…" />
  if (slug && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Package not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: PackageFormValues) => {
    savePackage.mutate(
      {
        title_ar: values.title_ar,
        title_en: values.title_en,
        category_id: Number(values.category_id),
        destination_id: Number(values.destination_id),
        description_ar: values.description_ar,
        description_en: values.description_en,
        duration_days: values.duration_days,
        included_services_ar: values.included_services_ar,
        included_services_en: values.included_services_en,
        price_from: values.price_from,
        cover_image: values.cover_image || null,
        is_featured: values.is_featured,
        is_active: values.is_active,
      },
      {
        onSuccess: () => {
          showToast(slug ? 'Package updated.' : 'Package created.')
          void navigate('/packages')
        },
        onError: (err: unknown) => {
          showToast(extractErrorMessage(err), 'error')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">{slug ? 'Edit Package' : 'New Package'}</h1>
      <Card>
        <PackageForm
          initialValues={pkg}
          isSubmitting={savePackage.isPending}
          submitLabel={slug ? 'Save changes' : 'Create package'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
