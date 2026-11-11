import { Fragment } from '@revealjs/react'
import './diagrams.css'

interface Step {
  instruction: string
  cached: boolean
}

const GOOD: Step[] = [
  { instruction: 'FROM ubuntu:24.04', cached: true },
  { instruction: 'RUN apt-get … curl jq', cached: true },
  { instruction: 'WORKDIR /app', cached: true },
  { instruction: 'COPY wetter.sh .', cached: false },
]

const BAD: Step[] = [
  { instruction: 'FROM ubuntu:24.04', cached: true },
  { instruction: 'WORKDIR /app', cached: true },
  { instruction: 'COPY wetter.sh .', cached: false },
  { instruction: 'RUN apt-get … curl jq', cached: false },
]

function Column({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <figure className="layer-order__column">
      <figcaption>{title}</figcaption>
      <ol>
        {steps.map((step) => (
          <li
            key={step.instruction}
            className={
              step.cached
                ? 'layer-order__step'
                : 'layer-order__step layer-order__step--rebuilt'
            }
          >
            <code>{step.instruction}</code>
            <span>{step.cached ? 'aus dem Cache' : 'neu gebaut'}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}

/**
 * Dieselben Anweisungen in zwei Reihenfolgen, nachdem sich wetter.sh geändert
 * hat: Ab der ersten geänderten Anweisung baut Docker alles darunter neu.
 */
export function LayerOrder() {
  return (
    <div className="layer-order">
      <Column title="Erst Pakete, dann Skript" steps={GOOD} />
      <Fragment as="div">
        <Column title="Erst Skript, dann Pakete" steps={BAD} />
      </Fragment>
    </div>
  )
}
