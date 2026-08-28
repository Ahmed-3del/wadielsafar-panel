import { Badge } from '@/components/ui'
import type { InquiryStatus } from '../types'

const STATUS_TONE: Record<InquiryStatus, 'neutral' | 'info' | 'warning' | 'success'> = {
  NEW: 'info',
  CONTACTED: 'warning',
  QUALIFIED: 'warning',
  CONVERTED: 'success',
  CLOSED: 'neutral',
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{status}</Badge>
}
