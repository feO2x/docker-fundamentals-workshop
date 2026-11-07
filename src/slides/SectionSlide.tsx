import { Slide } from '@revealjs/react'
import { findBlock } from '../data/agenda'
import { CenteredLayout } from './CenteredLayout'
import { slotOf } from './schedule'

interface Props {
  blockId: string
}

/**
 * Abschnittsfolie oben im Stack eines Blocks, erreichbar unter `#/<blockId>`.
 * Titel, Frage und Uhrzeit kommen aus der Agenda.
 */
export function SectionSlide({ blockId }: Props) {
  const block = findBlock(blockId)
  const slot = slotOf(blockId)

  return (
    <Slide id={blockId}>
      <CenteredLayout>
        <p className="eyebrow">
          {slot.start}-{slot.end} · {block.duration} min
          {block.praxis ? `, davon ${block.praxis} min Praxis` : null}
        </p>
        <h2 className="section-title">{block.title}</h2>
        {block.question && (
          <p className="question question--section">
            <span className="question__label">Euer Ziel</span>
            {block.question}
          </p>
        )}
      </CenteredLayout>
    </Slide>
  )
}
