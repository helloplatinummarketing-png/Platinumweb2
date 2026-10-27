import gsap from 'gsap'
import { useRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'

interface MagneticButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: 'gold' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Link styled as a button. Leans towards the cursor on hover and springs back;
 * the gold fill wipes in from the left (pure CSS, see .btn in index.css).
 */
export function MagneticButton({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  onMouseMove,
  onMouseLeave,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  const move = (e: MouseEvent<HTMLAnchorElement>) => {
    onMouseMove?.(e)
    const el = ref.current
    if (!el || reduceMotion()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * 0.28
    const y = (e.clientY - (r.top + r.height / 2)) * 0.4
    gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' })
  }

  const leave = (e: MouseEvent<HTMLAnchorElement>) => {
    onMouseLeave?.(e)
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <a
      ref={ref}
      {...rest}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`btn btn--${variant} btn--${size} ${className}`}
    >
      <span className="btn__label">{children}</span>
    </a>
  )
}
