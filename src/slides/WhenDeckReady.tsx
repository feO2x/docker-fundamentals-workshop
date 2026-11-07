import { useReveal } from '@revealjs/react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Rendert die Kinder erst, wenn Reveal bereit ist. Fragmente darin werden so
 * erst zusammen mit den Code-Schritten einsortiert und erscheinen danach.
 *
 * Hintergrund: `<Code>` kann erst hervorheben, wenn der Deck bereit ist. Erst
 * dann legt das Highlight-Plugin die Hervorhebungsschritte als Fragment-Kopien
 * an. Zu diesem Zeitpunkt hat Reveal alle übrigen Fragmente bereits nummeriert,
 * und Fragmente ohne Nummer sortiert es hinter alle nummerierten. Ohne diese
 * Komponente erschiene ein Fragment nach dem Codeblock also vor dessen Schritten.
 *
 * Die Kinder erscheinen erst einen Render nach dem Bereitwerden: Jeder `<Code>`
 * nummeriert die Fragmente seiner Folie neu, sobald er hervorgehoben wurde. Mit
 * zwei Codeblöcken auf einer Folie bekäme ein gleichzeitig eingefügtes Fragment
 * seine Nummer schon beim ersten Block - vor den Schritten des zweiten.
 *
 * Explizite `index`-Props außerhalb dieser Komponente helfen nicht: Reveal
 * nummeriert beim Start alle Fragmente lückenlos neu, solange die Code-Schritte
 * noch fehlen - ein Fragment mit `index={1}` bekommt dabei die 0. Innerhalb
 * dieser Komponente wirken sie: Ein Fragment mit dem Index eines Code-Schritts
 * erscheint zusammen mit diesem Schritt.
 */
export function WhenDeckReady({ children }: Props) {
  const deck = useReveal()
  const [codeHighlighted, setCodeHighlighted] = useState(false)

  useEffect(() => {
    // Der zusätzliche Render ist gewollt, siehe oben.
    // oxlint-disable-next-line react/set-state-in-effect
    if (deck) setCodeHighlighted(true)
  }, [deck])

  return codeHighlighted ? children : null
}
