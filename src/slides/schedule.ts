import { AGENDA, START_TIME } from '../data/agenda'
import { buildSchedule, type Slot } from '../lib/time'

/** Uhrzeiten aller Blöcke, in derselben Reihenfolge wie `AGENDA`. */
export const SCHEDULE = buildSchedule(
  START_TIME,
  AGENDA.map((block) => block.duration),
)

/** Start- und Endzeit eines Agenda-Blocks. */
export function slotOf(id: string): Slot {
  const index = AGENDA.findIndex((block) => block.id === id)
  if (index === -1) throw new Error(`Agenda-Block "${id}" nicht gefunden`)
  return SCHEDULE[index]
}
