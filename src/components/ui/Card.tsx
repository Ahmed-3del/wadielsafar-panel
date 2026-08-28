import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-stone-200 bg-white p-5 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
