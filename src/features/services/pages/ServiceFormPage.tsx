import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Spinner, ErrorState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { toNullableString } from '@/utils/formValues'
import { ServiceForm } from '../components/ServiceForm'
import { useService } from '../hooks/useService'
import { useSaveService } from '../hooks/useSaveService'
import type { ServiceFormValues } from '../schemas/serviceSchema'

export function ServiceFormPage() {
  const { id } = useParams<{ id: string }>()
  const serviceId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { data: service, isLoading, isError, error, refetch } = useService(serviceId)
  const saveService = useSaveService(serviceId)

  if (serviceId && isLoading) return <Spinner label="Loading service…" />
  if (serviceId && isError) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Service not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const handleSubmit = (values: ServiceFormValues) => {
    saveService.mutate(
      {
        name_ar: values.name_ar,
        name_en: values.name_en,
        description_ar: values.description_ar,
        description_en: values.description_en,
        icon: values.icon,
        // Trimmed, so a stray space cannot make "/visas " a path the site
        // routes to nowhere.
        link: values.link.trim(),
        image: toNullableString(values.image),
        order: values.order,
        is_active: values.is_active,
      },
      {
        onSuccess: () => {
          showToast(serviceId ? 'Service updated.' : 'Service created.')
          void navigate('/services')
        },
        onError: (err: unknown) => {
          showToast(extractErrorMessage(err), 'error')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-navy-900">
        {serviceId ? 'Edit Service' : 'New Service'}
      </h1>
      <Card>
        <ServiceForm
          initialValues={service}
          isSubmitting={saveService.isPending}
          submitLabel={serviceId ? 'Save changes' : 'Create service'}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}
