import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/** Vertikal zentrierte Folie, z. B. für Titel- und Abschnittsfolien. */
export function CenteredLayout({ children }: Props) {
  return <div className="layout layout--centered">{children}</div>
}
