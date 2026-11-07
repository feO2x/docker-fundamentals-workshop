import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

/** Inhaltsfolie: Titel fest oben, darunter ein Bereich, der die Resthöhe füllt. */
export function ContentLayout({ title, children }: Props) {
  return (
    <div className="layout layout--content">
      <h2>{title}</h2>
      <div className="layout__body">{children}</div>
    </div>
  )
}
