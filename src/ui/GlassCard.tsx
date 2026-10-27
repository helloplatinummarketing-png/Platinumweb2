import type { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  highlight?: boolean
}

/** Glass panel: blurred, ~5% white fill, 1px hairline. The core always shows through. */
export function GlassCard({ children, highlight = false, className = '', ...rest }: GlassCardProps) {
  return (
    <div
      {...rest}
      className={`glass ${highlight ? 'glass--gold' : ''} ${className}`}
    >
      <span aria-hidden="true" className="glass__corner glass__corner--tl" />
      <span aria-hidden="true" className="glass__corner glass__corner--br" />
      {children}
    </div>
  )
}
