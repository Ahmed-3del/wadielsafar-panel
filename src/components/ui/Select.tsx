import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { hasError = false, className = '', children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-navy-900 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-navy-700 disabled:cursor-not-allowed disabled:bg-stone-100
        ${hasError ? 'border-red-400' : 'border-stone-300'} ${className}`}
      {...props}
    >
      {children}
    </select>
  )
})
