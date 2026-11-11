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
      'Python 3.12 und 3.13 nebeneinander starten, dann mit dem .NET SDK eine App erstellen und ausführen, ohne etwas zu installieren. Zum Schluss nachsehen, auf welchem Linux die Images jeweils laufen.',
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
    duration: 30,
    praxis: 15,
    kind: 'content',
    summary:
      'Ein eigenes Image, Anweisung für Anweisung: FROM, RUN, COPY, WORKDIR, ENV sowie ENTRYPOINT und CMD, die gern verwechselt werden. Mit USER läuft eure Anwendung nicht als root. Lange RUN-Befehle über mehrere Zeilen, der Build-Kontext und mehrere Tags pro Build.',
    question:
      'Bisher habt ihr fremde Images benutzt. Wie beschreibt ihr ein Image für eure eigene Software?',
    commands: [
      'FROM',
      'RUN',
      'COPY',
      'WORKDIR',
      'ENV',
      'USER',
      'ENTRYPOINT',
      'CMD',
      'docker build -t',
      '.dockerignore',
    ],
    praxisNote:
      'Ein Image auf Basis von ubuntu:24.04 bauen, das ein kleines Skript samt seiner Werkzeuge curl und jq mitbringt, als Benutzer ubuntu statt root läuft und sich mit verschiedenen Argumenten starten lässt.',
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
    title: 'Multi-Stage-Builds',
    duration: 20,
    praxis: 10,
    kind: 'content',
    summary:
      'Multi-Stage-Builds trennen Bauen und Ausführen: Das .NET SDK kompiliert in der ersten Stage, ins fertige Image kommt nur die letzte. So baut ihr eine .NET-App, ohne selbst ein SDK installiert zu haben. Dazu die Wahl des Basis-Images: Ubuntu, Alpine oder chiseled.',
    question:
      'Zum Bauen braucht ihr Compiler und SDK, zum Ausführen nicht. Warum steckt beides in eurem Image?',
    commands: ['FROM … AS', 'COPY --from', 'dotnet publish', 'docker image ls'],
    praxisNote:
      'Eine kleine .NET-App erst einstufig auf dem SDK-Image bauen, dann in eine Build- und eine Runtime-Stage aufteilen und die Größe beider Images vergleichen.',
  },
  {
    id: 'compose',
    title: 'Docker Compose',
    duration: 15,
    kind: 'content',
    summary:
      'Eine Anwendung kommt selten allein. Docker Compose beschreibt mehrere Container samt Netzwerk und Volumes in einer Datei. Im selben Netzwerk erreichen sich Container über ihren Namen, ein Health Check zeigt, ob die Datenbank wirklich bereit ist, und depends_on startet die App erst dann.',
    question:
      'Eure App braucht eine Datenbank. Wie startet ihr beides zusammen, und zwar in der richtigen Reihenfolge?',
    commands: [
      'docker network create',
      'docker compose up -d',
      'docker compose ps',
      'docker compose logs',
      'docker compose down',
      'healthcheck',
      'depends_on',
    ],
  },
  {
    id: 'abschlussuebung',
    title: 'Abschlussübung',
    duration: 40,
    praxis: 40,
    kind: 'content',
    summary:
      'Alles aus dem Workshop an einem Stück: Ein Kollege hat einen kleinen Besucherzähler samt PostgreSQL-Datenbank mit Docker Compose aufgesetzt, aber nichts davon klappt richtig. Ihr findet die Fehler in Dockerfile und compose.yaml und bringt beides zum Laufen.',
    question:
      'Die App findet ihre Datenbank nicht, und nach einem Neustart sind die Daten weg. Was ist hier schiefgegangen?',
    commands: [
      'docker compose up -d --build',
      'docker compose ps -a',
      'docker compose logs',
      'docker compose down -v',
      'docker compose push',
    ],
    praxisNote:
      'Ein absichtlich kaputtes Setup reparieren: ein aufgeblähtes einstufiges Image, eine falsche Layer-Reihenfolge, eine App, die als root läuft, eine Datenbank unter localhost, eine App, die nicht auf die Datenbank wartet, und Daten ohne Volume. Wer fertig ist, pusht das Image in die lokale Registry.',
  },
  {
    id: 'fragen',
    title: 'Fragen',
    duration: 10,
    kind: 'buffer',
    summary: 'Zeit für eure Fragen und Tipps zum Weiterlernen.',
    question: 'Was ist noch offen, und was nehmt ihr mit?',
  },
]

/** Sucht einen Agenda-Block über seine Kennung. */
export function findBlock(id: string): AgendaBlock {
  const block = AGENDA.find((block) => block.id === id)
  if (!block) throw new Error(`Agenda-Block "${id}" nicht gefunden`)
  return block
}
