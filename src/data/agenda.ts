export type BlockKind = 'content' | 'break' | 'buffer'

export interface AgendaBlock {
  /** Stabile Kennung, z. B. als Folienanker (`slides.html#/<id>`). */
  id: string
  /** Kurzer Titel des Blocks, wie er in der Agenda steht. */
  title: string
  /** Dauer in Minuten. */
  duration: number
  /** Davon praktische Übungszeit in Minuten. */
  praxis?: number
  kind: BlockKind
  /** Ein bis zwei Sätze zum Inhalt, für die Agenda-Seite. */
  summary?: string
  /**
   * Frage, mit der der Block auf den Folien beginnt. Anders als `summary`
   * spricht sie die Teilnehmer direkt an.
   */
  question?: string
  /** Kommandos, die in diesem Block eingeführt werden. */
  commands?: string[]
  /** Was die Teilnehmer in der Übung konkret tun. */
  praxisNote?: string
}

/** Startzeit des Workshops, Basis für alle berechneten Uhrzeiten. */
export const START_TIME = '08:30'

export const AGENDA: AgendaBlock[] = [
  {
    id: 'warum-docker',
    title: 'Warum Docker?',
    duration: 15,
    praxis: 5,
    kind: 'content',
    summary:
      'Software installieren heißt Abhängigkeiten installieren: Laufzeitumgebung, Bibliotheken, Konfiguration. Ein Image bündelt all das und beschreibt den kompletten User Space, nur den Kernel liefert der Host. Installieren und Ausliefern wird damit zu einem einzigen docker run.',
    question:
      'Eure Anwendung läuft auf eurem Rechner. Was muss alles auf den Server, damit sie dort auch läuft?',
    commands: ['docker run --rm', 'cat /etc/os-release'],
    praxisNote:
      'Python 3.12 und 3.13 nebeneinander starten, ohne etwas zu installieren, und nachsehen, auf welchem Linux sie jeweils laufen.',
  },
  {
    id: 'konzepte',
    title: 'Image, Container, Registry',
    duration: 15,
    praxis: 5,
    kind: 'content',
    summary:
      'Das Image ist der Bauplan, der Container die laufende Instanz davon, die Registry das Lager für Images. Dazu der Aufbau einer Image-Referenz aus Registry, Name und Tag.',
    question: 'Was genau lädt docker run eigentlich herunter, und wo kommt es her?',
    commands: ['docker pull', 'docker image ls', 'docker image inspect'],
    praxisNote:
      'Zwei Container aus demselben Image starten und in einem eine Datei anlegen. Der andere sieht sie nicht.',
  },
  {
    id: 'lebenszyklus',
    title: 'Container-Lebenszyklus',
    duration: 25,
    praxis: 15,
    kind: 'content',
    summary:
      'Recap von run und exec, dann alles, was zum Alltag mit Containern gehört: im Hintergrund starten, Ports freigeben, Umgebungsvariablen setzen, Logs lesen, stoppen und aufräumen.',
    question:
      'Ein Webserver läuft in einem Container. Wie erreicht ihr ihn, und wie seht ihr, was er tut?',
    commands: [
      'docker run -d --name -p -e',
      'docker ps -a',
      'docker logs -n -f',
      'docker exec',
      'docker stop',
      'docker start',
      'docker rm',
    ],
    praxisNote:
      'nginx im Hintergrund starten und im Browser öffnen, die Logs live mitlesen, mit exec hineinschauen, dann stoppen, neu starten und löschen.',
  },
  {
    id: 'volumes',
    title: 'Volumes & Bind Mounts',
    duration: 20,
    praxis: 12,
    kind: 'content',
    summary:
      'Container sind Wegwerfware: Mit docker rm ist alles weg, was darin geschrieben wurde. Named Volumes halten Daten über den Container hinaus, Bind Mounts holen Dateien vom eigenen Rechner hinein.',
    question: 'Ihr löscht einen Container. Wo sind eure Daten jetzt?',
    commands: ['docker run -v', 'docker volume create', 'docker volume ls'],
    praxisNote:
      'Eine eigene index.html per Bind Mount in nginx einhängen und live ändern. Dann in ein Named Volume schreiben, den Container löschen und die Datei im nächsten Container wiederfinden.',
  },
  { id: 'pause-1', title: 'Pause', duration: 10, kind: 'break' },
  {
    id: 'dockerfile',
    title: 'Das erste Dockerfile',
    duration: 35,
    praxis: 20,
    kind: 'content',
    summary:
      'Ein eigenes Image, Anweisung für Anweisung: FROM, RUN, COPY, WORKDIR, ENV sowie ENTRYPOINT und CMD, die gern verwechselt werden. Lange RUN-Befehle über mehrere Zeilen, der Build-Kontext und mehrere Tags pro Build.',
    question:
      'Bisher habt ihr fremde Images benutzt. Wie beschreibt ihr ein Image für eure eigene Software?',
    commands: [
      'FROM',
      'RUN',
      'COPY',
      'WORKDIR',
      'ENV',
      'ENTRYPOINT',
      'CMD',
      'docker build -t',
      '.dockerignore',
    ],
    praxisNote:
      'Ein Image auf Basis von ubuntu:24.04 bauen, das ein kleines Skript samt seiner Werkzeuge curl und jq mitbringt, und es mit verschiedenen Argumenten starten.',
  },
  {
    id: 'layer-caching',
    title: 'Layer & Caching',
    duration: 15,
    praxis: 10,
    kind: 'content',
    summary:
      'Jede Anweisung erzeugt einen Layer, und Docker baut nur neu, was sich geändert hat. Die Reihenfolge im Dockerfile entscheidet, ob ein Build Sekunden oder Minuten dauert. Und darum gehören apt-get update und install in ein einziges RUN.',
    question:
      'Ihr ändert eine Zeile in eurem Skript. Warum dauert der zweite Build nur eine Sekunde?',
    commands: ['docker history', 'docker build'],
    praxisNote:
      'Das Skript ändern und zusehen, welche Schritte aus dem Cache kommen. Dann COPY vor die Paketinstallation ziehen und den Unterschied messen.',
  },
  {
    id: 'registry',
    title: 'Taggen & Pushen',
    duration: 15,
    praxis: 10,
    kind: 'content',
    summary:
      'Wie ein Image in eine Registry kommt und von dort auf jeden anderen Rechner. Dazu die Falle mit dem Tag latest.',
    question: 'Euer Image liegt nur auf eurem Rechner. Wie kommt es auf den Server?',
    commands: ['docker tag', 'docker push', 'docker login'],
    praxisNote:
      'Eine eigene Registry mit registry:2 als Container starten, das Image dorthin pushen, lokal löschen und wieder pullen.',
  },
  { id: 'pause-2', title: 'Pause', duration: 10, kind: 'break' },
  {
    id: 'multi-stage',
    title: 'Praxisbeispiel & Multi-Stage',
    duration: 35,
    praxis: 20,
    kind: 'content',
    summary:
      'Ein echtes Dockerfile aus NukeExtensions, Zeile für Zeile, mit Labels nach OCI-Standard. Multi-Stage-Builds trennen Bauen und Ausführen, ins fertige Image kommt nur die letzte Stage. Dazu die Wahl des Basis-Images: Debian, Alpine oder FROM scratch.',
    question:
      'Zum Bauen braucht ihr Compiler und SDK, zum Ausführen nicht. Warum steckt beides in eurem Image?',
    commands: ['LABEL', 'FROM … AS', 'COPY --from', 'docker image ls'],
    praxisNote:
      'Ein einstufiges Dockerfile in eine Build- und eine Runtime-Stage aufteilen und die Größe beider Images vergleichen.',
  },
  {
    // Offen: Entweder schreiben die Teilnehmer das Dockerfile von Grund auf, oder
    // sie reparieren ein absichtlich kaputtes (falsche Layer-Reihenfolge, Port nicht
    // freigegeben, Daten im Container statt im Volume, aufgeblähtes einstufiges
    // Image). Summary und praxisNote passen bis zur Entscheidung auf beide Varianten.
    id: 'abschlussuebung',
    title: 'Abschlussübung',
    duration: 30,
    praxis: 30,
    kind: 'content',
    summary:
      'Alles aus dem Workshop an einem Stück: Eine kleine Anwendung kommt in ein Image, läuft als Container und landet in der Registry.',
    question: 'Eine Anwendung soll in einen Container. Was braucht ihr dafür alles?',
    commands: ['docker build', 'docker run -p -v', 'docker logs', 'docker push'],
    praxisNote:
      'Dockerfile mit Multi-Stage-Build, Image bauen und taggen, Container mit Port und Volume starten, Logs prüfen und das Image in die lokale Registry pushen.',
  },
  {
    id: 'ausblick',
    title: 'Ausblick & Fragen',
    duration: 15,
    kind: 'buffer',
    summary:
      'Je ein kurzer Blick auf Docker Compose, Netzwerke, Health Checks und Multi-Arch-Images. Dazu offene Fragen und Tipps zum Weiterlernen.',
    question: 'Was nehmt ihr mit aus dem Workshop?',
    commands: ['docker compose up', 'docker network', 'HEALTHCHECK', '--platform'],
  },
]

/** Sucht einen Agenda-Block über seine Kennung. */
export function findBlock(id: string): AgendaBlock {
  const block = AGENDA.find((block) => block.id === id)
  if (!block) throw new Error(`Agenda-Block "${id}" nicht gefunden`)
  return block
}
