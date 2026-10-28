import type { AgendaBlock } from '../data/agenda'
import { buildSchedule } from '../lib/time'

interface Props {
  blocks: AgendaBlock[]
  start: string
}

export function AgendaList({ blocks, start }: Props) {
  const schedule = buildSchedule(
    start,
    blocks.map((block) => block.duration),
  )

  return (
    <ol className="agenda">
      {blocks.map((block, index) => {
        const slot = schedule[index]
        return (
          <li key={block.id} className="block" data-kind={block.kind}>
            <div className="block__slot">
              <time className="block__time" dateTime={slot.start}>
                {slot.start}
              </time>
              <span className="block__duration">{block.duration} min</span>
            </div>

            <div className="block__body">
              <h3 className="block__title">{block.title}</h3>

              {block.summary && <p className="block__summary">{block.summary}</p>}

              {block.commands && (
                <ul className="commands">
                  {block.commands.map((command) => (
                    <li key={command}>
                      <code>{command}</code>
                    </li>
                  ))}
                </ul>
              )}

              {block.praxisNote && (
                <p className="block__praxis-note">
                  <span className="block__praxis-label">Übung</span>
                  {block.praxisNote}
                </p>
              )}
            </div>

            <div className="block__praxis">
              {block.praxis ? (
                <span className="praxis-badge">
                  {block.praxis} min<span className="praxis-badge__word"> Praxis</span>
                </span>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
