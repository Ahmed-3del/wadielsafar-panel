import type { ChangeEvent } from 'react'
import { Select } from '@/components/ui'
import type { TestimonialFilters } from '../types'

interface TestimonialFiltersBarProps {
  filters: TestimonialFilters
  onChange: (filters: TestimonialFilters) => void
}

export function TestimonialFiltersBar({ filters, onChange }: TestimonialFiltersBarProps) {
  const handleApprovalChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onChange({ ...filters, is_approved: value ? (value as TestimonialFilters['is_approved']) : undefined })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={filters.is_approved ?? ''} onChange={handleApprovalChange} className="w-52">
        <option value="">All testimonials</option>
        <option value="false">Pending approval</option>
        <option value="true">Approved</option>
      </Select>
    </div>
  )
}
