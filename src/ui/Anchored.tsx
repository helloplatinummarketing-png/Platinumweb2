import type { ReactNode } from 'react'

interface AnchoredProps {
  /** 'petal:0'..'petal:11', 'hub' or 'screen'. */
  to: string
  children: ReactNode
  /** Reveal on arrival ('fade') or with one of the shot's steps (a number). */
  reveal?: 'fade' | number
  className?: string
  bodyClassName?: string
}

/**
 * A label pinned to a point on the 3D core. AnchorProjector moves the wrapper
 * every frame; reveals animate the inner body so the two transforms never fight.
 */
export function Anchored({ to, children, reveal = 'fade', className = '', bodyClassName = '' }: AnchoredProps) {
  const revealProps = reveal === 'fade' ? { 'data-fade': '' } : { 'data-step': reveal }
  return (
    <div data-anchor={to} className={`anchor ${className}`}>
      <span aria-hidden="true" className="anchor__dot" />
      <span aria-hidden="true" className="anchor__line" />
      <div {...revealProps} className={`anchor__body ${bodyClassName}`}>
        {children}
      </div>
    </div>
  )
}
