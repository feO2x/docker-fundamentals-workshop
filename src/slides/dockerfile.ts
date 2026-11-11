// Die Folien zeigen die Dockerfiles aus exercises/ direkt (Import mit ?raw).
// So steht dort genau das, was der Workflow exercises.yml baut und prüft.

/** Zeilen eines Dockerfiles ohne Kommentarzeilen und Leerzeilen am Ende. */
export function dockerfileLines(raw: string): string[] {
  return raw
    .trimEnd()
    .split('\n')
    .filter((line) => !line.startsWith('#'))
}

/** 1-basierte Nummer der ersten Zeile, die mit `prefix` beginnt. */
export function lineOf(lines: string[], prefix: string): number {
  const index = lines.findIndex((line) => line.startsWith(prefix))
  if (index === -1) throw new Error(`Keine Zeile beginnt mit "${prefix}"`)
  return index + 1
}
