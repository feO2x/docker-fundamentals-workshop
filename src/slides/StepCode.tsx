import { Code } from '@revealjs/react'

interface Props {
  /** Eine Zeile pro Eintrag. */
  lines: string[]
  /**
   * Hervorhebungsschritte in Reveals Syntax, z. B. "1-2|3-4".
   * Standard: ein Schritt pro Zeile, bei nur einer Zeile keiner. `false`
   * zeigt alle Zeilen auf einmal, z. B. als Erinnerung auf einer Übungsfolie.
   */
  steps?: string | false
  /** `bash` für reine Kommandos, `shell` für Prompt und Ausgabe. */
  language?: 'bash' | 'shell' | 'dockerfile'
  className?: string
}

/** Codeblock, dessen Zeilen nacheinander hervorgehoben werden. */
export function StepCode({ lines, steps, language = 'bash', className }: Props) {
  const lineNumbers =
    steps === false
      ? undefined
      : (steps ??
        (lines.length > 1 ? lines.map((_, index) => index + 1).join('|') : undefined))

  return (
    <Code language={language} lineNumbers={lineNumbers} className={className}>
      {lines.join('\n')}
    </Code>
  )
}
