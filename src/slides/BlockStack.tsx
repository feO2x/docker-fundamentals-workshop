import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Vertikaler Stack für die Folien eines Blocks, mit der Abschnittsfolie oben.
 *
 * Wie `Stack` aus `@revealjs/react`, aber mit `data-start-indexv`: Ohne das
 * setzt Reveal einen Stack beim Betreten mit → an der zuletzt gezeigten Folie
 * fort. Wer nach einem Sprung zurückgeht und wieder vorwärts blättert, würde so
 * den Anfang des Blocks überspringen, und Pos1 landete nicht auf der Titelfolie.
 */
export function BlockStack({ children }: Props) {
  return <section data-start-indexv="0">{children}</section>
}
