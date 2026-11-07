import { Fragment } from '@revealjs/react'
import type { ReactNode } from 'react'
import './diagrams.css'

export interface FlowStep {
  title: ReactNode
  text?: ReactNode
  /** Hebt den Schritt hervor, z. B. das Ergebnis. */
  accent?: boolean
}

interface Props {
  steps: FlowStep[]
  /** Beschriftung der Pfeile, einer weniger als Schritte. */
  arrows: ReactNode[]
  /** Pfeile und folgende Schritte erscheinen nacheinander. */
  animate?: boolean
}

function Step({ step }: { step: FlowStep }) {
  return (
    <div className={step.accent ? 'flow__step flow__step--accent' : 'flow__step'}>
      <strong>{step.title}</strong>
      {step.text && <span>{step.text}</span>}
    </div>
  )
}

/** Kästen von links nach rechts, verbunden durch beschriftete Pfeile. */
export function Flow({ steps, arrows, animate = false }: Props) {
  const [first, ...rest] = steps

  return (
    <div className="flow">
      <Step step={first} />
      {rest.map((step, index) => {
        const content = (
          <>
            <div className="flow__arrow">
              <span>{arrows[index]}</span>
            </div>
            <Step step={step} />
          </>
        )
        // Pfeil und Kasten als Gruppe, damit sie gemeinsam erscheinen.
        return animate ? (
          <Fragment key={index} as="div" className="flow__group">
            {content}
          </Fragment>
        ) : (
          <div key={index} className="flow__group">
            {content}
          </div>
        )
      })}
    </div>
  )
}
