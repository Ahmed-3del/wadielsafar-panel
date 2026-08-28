interface SpinnerProps {
  label?: string
  className?: string
}

export function Spinner({ label = 'Loading…', className = '' }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 py-8 text-stone-500 ${className}`} role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-navy-700" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
