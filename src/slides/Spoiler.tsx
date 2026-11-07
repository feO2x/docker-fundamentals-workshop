import { Fragment } from '@revealjs/react'
import type { ReactNode } from 'react'

interface Props {
  /** Die Lösung, die erst im zweiten Schritt erscheint. */
  children: ReactNode
}

/**
 * Hält eine Lösung zurück: Der erste Schritt fragt nach, der zweite blendet
 * die Frage aus und die Lösung an derselben Stelle ein. So sieht niemand die
 * Lösung, nur weil die Folie aus Versehen weitergeschaltet wurde.
 */
export function Spoiler({ children }: Props) {
  return (
    <div className="r-stack spoiler">
      <Fragment as="p" animation="fade-in-then-out" className="spoiler__prompt">
        Möchtet ihr die Lösung wirklich anzeigen?
      </Fragment>
      <Fragment className="spoiler__solution">{children}</Fragment>
    </div>
  )
}
