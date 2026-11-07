export interface RefPart {
  text: string
  /** Bestimmt die Farbe: Registry, Name im Repository, Tag oder Trenner. */
  role: 'registry' | 'name' | 'tag' | 'separator'
}

interface Props {
  parts: RefPart[]
}

/** Eine Image-Referenz, groß und nach Bestandteilen eingefärbt. */
export function RefAnatomy({ parts }: Props) {
  return (
    <p className="ref-anatomy">
      {parts.map((part, index) => (
        <span key={index} className={`ref-anatomy__${part.role}`}>
          {part.text}
        </span>
      ))}
    </p>
  )
}
