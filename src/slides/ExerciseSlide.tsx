import { Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import { findBlock } from '../data/agenda'
import { ContentLayout } from './ContentLayout'

interface Props {
  /** Agenda-Block, aus dem die Übungszeit stammt. */
  blockId: string
  title: string
  /** Aufgaben oder Fragen, eine pro Listeneintrag. */
  tasks: ReactNode[]
  /** Nummerierte Liste, z. B. für die Fragen der Schnitzeljagd. */
  numbered?: boolean
  /** Übungszeit, falls sich ein Block auf mehrere Übungen aufteilt. */
  minutes?: number
  /** Weiterer Inhalt unter dem Übungskasten, z. B. Kommandos oder Hinweise. */
  children?: ReactNode
}

/** Übungsfolie: die Aufgaben eines Blocks im Übungskasten. */
export function ExerciseSlide({
  blockId,
  title,
  tasks,
  numbered = false,
  minutes,
  children,
}: Props) {
  const block = findBlock(blockId)
  const List = numbered ? 'ol' : 'ul'
  const duration = minutes ?? block.praxis

  return (
    <Slide>
      <ContentLayout title={title}>
        <div className="exercise exercise--slide">
          <span className="exercise__label">
            Übung{duration ? ` · ${duration} min` : null}
          </span>
          <List className="exercise__tasks">
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </List>
        </div>
        {children}
      </ContentLayout>
    </Slide>
  )
}
