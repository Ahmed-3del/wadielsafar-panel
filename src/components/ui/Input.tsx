import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`block w-full rounded-md border px-3 py-2 text-sm text-navy-900 shadow-sm
        placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-navy-700
        disabled:cursor-not-allowed disabled:bg-stone-100
        ${hasError ? 'border-red-400' : 'border-stone-300'} ${className}`}
      {...props}
    />
  )
})
