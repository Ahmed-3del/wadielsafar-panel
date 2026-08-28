import { Badge } from '@/components/ui'
import { OFFER_STATUS_TONE, type OfferStatus } from '../types'

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  return <Badge tone={OFFER_STATUS_TONE[status]}>{status}</Badge>
}
