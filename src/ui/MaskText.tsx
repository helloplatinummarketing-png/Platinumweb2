import { Fragment, type ElementType, type ReactNode } from 'react'

interface MaskTextProps {
  as?: ElementType
  /** A string, or an array of strings to force line breaks. */
  text: string | string[]
  className?: string
  id?: string
}

/**
 * Text split into words, each inside an overflow mask, so the timeline can
 * slide them up line by line. Screen readers get the plain text once, the split copy is hidden from them.
 */
export function MaskText({ as: Tag = 'span', text, className = '', id }: MaskTextProps) {
  const lines = Array.isArray(text) ? text : [text]
  const plain = lines.join(' ')
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{plain}</span>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(' ').map((word, wi): ReactNode => (
            <Fragment key={wi}>
              {wi > 0 ? ' ' : null}
              <span className="mask-word">
                <span data-wi className="mask-word__inner">
                  {word}
                </span>
              </span>
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}
