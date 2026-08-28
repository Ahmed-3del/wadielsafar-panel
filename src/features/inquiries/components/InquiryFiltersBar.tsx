import type { ChangeEvent } from 'react'
import { Select } from '@/components/ui'
import { INQUIRY_STATUSES, SERVICE_TYPES, type InquiryFilters } from '../types'

interface InquiryFiltersBarProps {
  filters: InquiryFilters
  onChange: (filters: InquiryFilters) => void
}

export function InquiryFiltersBar({ filters, onChange }: InquiryFiltersBarProps) {
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onChange({ ...filters, status: value ? (value as InquiryFilters['status']) : undefined })
  }

  const handleServiceTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onChange({ ...filters, service_type: value ? (value as InquiryFilters['service_type']) : undefined })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={filters.status ?? ''} onChange={handleStatusChange} className="w-44">
        <option value="">All statuses</option>
        {INQUIRY_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>
      <Select value={filters.service_type ?? ''} onChange={handleServiceTypeChange} className="w-44">
        <option value="">All service types</option>
        {SERVICE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
    </div>
  )
}
