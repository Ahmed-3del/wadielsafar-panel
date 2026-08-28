import { Link, useParams } from 'react-router-dom'
import { Card, Select } from '@/components/ui'
import { Spinner, ErrorState } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import { InquiryStatusBadge } from '../components/InquiryStatusBadge'
import { useInquiry } from '../hooks/useInquiry'
import { useUpdateInquiryStatus } from '../hooks/useUpdateInquiryStatus'
import { INQUIRY_STATUSES, type InquiryStatus } from '../types'

export function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const inquiryId = Number(id)
  const { data: inquiry, isLoading, isError, error, refetch } = useInquiry(inquiryId)
  const updateStatus = useUpdateInquiryStatus(inquiryId)

  if (isLoading) return <Spinner label="Loading inquiry…" />
  if (isError || !inquiry) {
    return (
      <ErrorState
        message={error ? extractErrorMessage(error) : 'Inquiry not found.'}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/inquiries" className="text-sm text-navy-700 hover:underline">
        &larr; Back to inquiries
      </Link>
      <Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-navy-900">{inquiry.name}</h1>
            <p className="text-sm text-stone-500">
              {inquiry.email} · {inquiry.phone}
            </p>
          </div>
          <InquiryStatusBadge status={inquiry.status} />
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-stone-500">Service type</dt>
            <dd className="text-stone-800">{inquiry.service_type}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Travel date</dt>
            <dd className="text-stone-800">{formatDate(inquiry.travel_date)}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Source</dt>
            <dd className="text-stone-800">{inquiry.source}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Received</dt>
            <dd className="text-stone-800">{formatDateTime(inquiry.created_at)}</dd>
          </div>
        </dl>

        {inquiry.details && Object.keys(inquiry.details).length > 0 && (
          <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-medium text-stone-700">Request details</p>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.entries(inquiry.details).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">
                    {key.replace(/_/g, ' ')}
                  </dt>
                  <dd className="text-sm text-stone-800">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div>
          <p className="text-sm text-stone-500">Message</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-stone-800">{inquiry.message}</p>
        </div>

        <div className="flex items-end gap-3 border-t border-stone-100 pt-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-sm font-medium text-stone-700">
              Update status
            </label>
            <Select
              id="status"
              value={inquiry.status}
              disabled={updateStatus.isPending}
              onChange={(event) => {
                updateStatus.mutate(event.target.value as InquiryStatus)
              }}
              className="w-48"
            >
              {INQUIRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
          {updateStatus.isPending && <span className="text-sm text-stone-500">Saving…</span>}
        </div>
      </Card>
    </div>
  )
}
