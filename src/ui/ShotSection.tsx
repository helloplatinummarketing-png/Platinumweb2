import type { CSSProperties, ReactNode } from 'react'
import { SHOTS } from '../timeline/shots'

interface ShotSectionProps {
  id: string
  labelledBy?: string
  className?: string
  contentClassName?: string
  children: ReactNode
}

/**
 * One camera shot's worth of page. Pinned shots are tall sections with a
 * sticky, full-viewport content layer; consecutive pinned shots overlap by one
 * viewport so the next shot's copy appears in place instead of scrolling in.
 * The master timeline handles every reveal and exit.
 */
export function ShotSection({ id, labelledBy, className = '', contentClassName = '', children }: ShotSectionProps) {
  const i = SHOTS.findIndex((s) => s.id === id)
  const shot = SHOTS[i]
  const overlap = shot.pin && i > 0 && SHOTS[i - 1].pin
  const style = { '--len-d': shot.length, '--len-m': shot.mobileLength } as CSSProperties

  return (
    <section
      id={id}
      data-shot={id}
      aria-labelledby={labelledBy}
      style={style}
      className={`shot ${shot.pin ? 'shot--pinned' : 'shot--flow'} ${overlap ? 'shot--overlap' : ''} ${className}`}
    >
      <div data-shot-content className={`shot__content ${contentClassName}`}>
        {children}
      </div>
    </section>
  )
}
