import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  /** Guidance shown under the control; hidden while an error is displayed so
   *  the two never compete for the same spot. */
  hint?: string
  /** Grid placement from the parent form, e.g. spanning both columns. */
  className?: string
  children: ReactNode
}

/** Label + error chrome shared by every feature form field, so validation feedback stays consistent. */
export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1${className ? ` ${className}` : ''}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-stone-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
