import { Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import { findBlock } from '../data/agenda'
import { CenteredLayout } from './CenteredLayout'
import { slotOf } from './schedule'

interface Props {
  blockId: string
  /** Hinweis für die Zeit nach der Pause. */
  children?: ReactNode
}

/** Pausenfolie mit der Uhrzeit, zu der es weitergeht. */
export function BreakSlide({ blockId, children }: Props) {
  const block = findBlock(blockId)
  const slot = slotOf(blockId)

  return (
    <Slide id={blockId}>
      <CenteredLayout>
        <p className="eyebrow">{block.duration} min</p>
        <h2 className="section-title">{block.title}</h2>
        <p className="break-time">weiter um {slot.end}</p>
        {children && <p className="lede">{children}</p>}
      </CenteredLayout>
    </Slide>
  )
}
