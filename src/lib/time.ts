/** Wandelt "09:00" in Minuten seit Mitternacht um. */
function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/** Wandelt Minuten seit Mitternacht zurück in "HH:MM". */
function toClock(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export interface Slot {
  start: string
  end: string
}

/** Legt die Blöcke ab der Startzeit lückenlos hintereinander. */
export function buildSchedule(start: string, durations: number[]): Slot[] {
  let cursor = toMinutes(start)
  return durations.map((duration) => {
    const slot = { start: toClock(cursor), end: toClock(cursor + duration) }
    cursor += duration
    return slot
  })
}

/** "145 min" wird zu "2 h 25 min". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}
