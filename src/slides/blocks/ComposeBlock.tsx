import { Fragment, Slide } from '@revealjs/react'
import demoCompose from '../../../exercises/datenbank/compose.yaml?raw'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { Flow } from '../diagrams/Flow'
import { dockerfileLines } from '../dockerfile'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'compose'

// Das Beispiel liegt in exercises/datenbank, der Workflow exercises.yml startet es.
const composeLines = dockerfileLines(demoCompose)

/** 1-basierte Nummer der Zeile, die samt Einrückung mit `prefix` beginnt. */
function at(prefix: string): number {
  const index = composeLines.findIndex((line) => line.startsWith(prefix))
  if (index === -1) throw new Error(`Keine Zeile beginnt mit "${prefix}"`)
  return index + 1
}

const adminer = at('  adminer:')
const db = at('  db:')
const dependsOn = at('    depends_on:')
const healthcheck = at('    healthcheck:')
const volumes = at('volumes:')

// Die erste Folie zeigt die Datei ohne depends_on und healthcheck, die beiden kommen
// danach. Schritte: Adminer, die Datenbank, die Volumes unten.
const anatomyLines = composeLines.filter(
  (_, i) =>
    !(i >= dependsOn - 1 && i < db - 2) && !(i >= healthcheck - 1 && i < volumes - 2),
)
const anatomyAt = (line: number) => anatomyLines.indexOf(composeLines[line - 1]) + 1
const anatomySteps = [
  `${anatomyAt(adminer)}-${anatomyAt(dependsOn - 1)}`,
  `${anatomyAt(db)}-${anatomyAt(healthcheck - 1)}`,
  `${anatomyAt(volumes)}-${anatomyLines.length}`,
].join('|')

// Ausschnitte für Health Check und depends_on, jeweils ein Dienst.
const dbLines = composeLines.slice(db - 1, volumes - 2)
const healthSteps = `${healthcheck - db + 1}-${dbLines.length}`
const adminerLines = composeLines.slice(adminer - 1, db - 2)
const dependsSteps = `${dependsOn - adminer + 1}-${adminerLines.length}`

/** Block „Docker Compose“: Netzwerke, compose.yaml, Health Checks, Startreihenfolge. */
export function ComposeBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Netzwerke: Container sprechen miteinander">
          <StepCode
            language="shell"
            lines={[
              '$ docker network create workshop',
              '$ docker network connect workshop registry',
              '$ docker run --rm --network workshop --entrypoint curl wetter:1.0 \\',
              '    -s http://registry:5000/v2/_catalog',
              '{"repositories":["wetter"]}',
            ]}
            steps="1-2|3-5"
            className="code--small"
          />
          <WhenDeckReady>
            <ul className="points">
              <Fragment as="li">
                Im selben Netzwerk erreichen sich Container über ihren Namen. Es zählt der
                Port im Container: <code>registry:5000</code>, nicht 5050.
              </Fragment>
              <Fragment as="li">
                <code>localhost</code> ist im Container immer der Container selbst.
              </Fragment>
              <Fragment as="li">
                Das Standardnetzwerk <code>bridge</code>, in dem alle Container ohne{' '}
                <code>--network</code> landen, kennt keine Namen. Darum das eigene
                Netzwerk.
              </Fragment>
            </ul>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Docker Compose: docker run als Datei">
          <div className="columns columns--code">
            <StepCode
              language="yaml"
              lines={anatomyLines}
              steps={anatomySteps}
              className="code--dense"
            />
            {/* Jeder Punkt erscheint mit seinem Schritt: Adminer, Datenbank, Volumes. */}
            <WhenDeckReady>
              <ul className="points">
                <li>
                  Eine <code>compose.yaml</code> beschreibt mehrere Container, die
                  zusammengehören. Jeder Dienst unter <code>services</code> wird ein
                  Container.
                </li>
                <Fragment as="li" index={0}>
                  <code>image</code>, <code>ports</code>, <code>environment</code> und{' '}
                  <code>volumes</code> kennt ihr von <code>docker run</code>. Statt{' '}
                  <code>image</code> baut <code>build: .</code> das Dockerfile im Ordner.
                </Fragment>
                <Fragment as="li" index={1}>
                  Benannte Volumes stehen unten. Ab Postgres 18 gehört das Volume nach{' '}
                  <code>/var/lib/postgresql</code>, nicht nach <code>…/data</code> wie in
                  vielen Anleitungen.
                </Fragment>
              </ul>
            </WhenDeckReady>
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Kommando für alles">
          <StepCode
            language="shell"
            lines={[
              '$ docker compose up -d',
              ' Container datenbank-db-1 Healthy',
              ' Container datenbank-adminer-1 Started',
              '$ docker compose ps',
              'NAME                  SERVICE   STATUS                   PORTS',
              'datenbank-adminer-1   adminer   Up Less than a second    0.0.0.0:8080->8080/tcp',
              'datenbank-db-1        db        Up 2 seconds (healthy)   5432/tcp',
            ]}
            steps="1-3|4-7"
            className="code--small"
          />
          <WhenDeckReady>
            <ul className="points">
              <Fragment as="li">
                Compose liest die <code>compose.yaml</code> im aktuellen Ordner. Der
                Ordnername wird zum Projektnamen: <code>datenbank-db-1</code>.
              </Fragment>
              <Fragment as="li">
                <code>docker compose logs db</code> zeigt die Logs eines Dienstes,{' '}
                <code>ps -a</code> auch beendete Container.
              </Fragment>
              <Fragment as="li">
                <code>docker compose down</code> räumt Container und Netzwerk weg, das
                Volume bleibt. <code>down -v</code> löscht es mit.
              </Fragment>
            </ul>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Netzwerk pro Projekt">
          <Flow
            animate
            steps={[
              { title: 'Browser', text: 'auf eurem Rechner' },
              { title: 'adminer', text: 'Container' },
              { title: 'db', text: 'Container', accent: true },
            ]}
            arrows={['localhost:8080', 'db:5432']}
          />
          <ul className="points">
            <Fragment as="li">
              Compose legt für jedes Projekt ein Netzwerk an,{' '}
              <code>datenbank_default</code>. Darin heißt jeder Container wie sein Dienst.
            </Fragment>
            <Fragment as="li">
              Adminer unter <code>localhost:8080</code> schlägt als Server schon{' '}
              <code>db</code> vor. Mit <code>localhost</code> landet er bei sich selbst.
            </Fragment>
            <Fragment as="li">
              <code>db</code> braucht kein <code>ports</code>: Das gibt einen Port nur für
              den Host frei. Im Netzwerk ist er ohnehin erreichbar.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Health Checks: Läuft sie nur, oder geht sie auch?">
          <div className="columns columns--code">
            <StepCode
              language="yaml"
              lines={dbLines}
              steps={healthSteps}
              className="code--small"
            />
            <WhenDeckReady>
              <ul className="points">
                <li>
                  Docker führt <code>test</code> alle 2 s im Container aus,{' '}
                  <code>ps</code> zeigt <code>(healthy)</code>.
                </li>
                <Fragment as="li">
                  Ohne <code>-h localhost</code> fragt <code>pg_isready</code> per Socket
                  und meldet „bereit“, während Postgres noch einrichtet.
                </Fragment>
                <Fragment as="li">
                  Im Dockerfile heißt das <code>HEALTHCHECK</code>. Das Kommando muss im
                  Image stecken: <code>aspnet</code> hat kein <code>curl</code>.
                </Fragment>
              </ul>
            </WhenDeckReady>
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="depends_on: Gestartet ist nicht bereit">
          <div className="columns columns--code">
            <StepCode
              language="yaml"
              lines={adminerLines}
              steps={dependsSteps}
              className="code--small"
            />
            <StepCode
              language="shell"
              lines={[
                '$ docker compose up -d',
                ' Container datenbank-db-1 Started',
                ' Container datenbank-db-1 Waiting',
                ' Container datenbank-db-1 Healthy',
                ' Container datenbank-adminer-1 Started',
              ]}
              steps={false}
              className="code--small"
            />
          </div>
          <WhenDeckReady>
            <ul className="points">
              <Fragment as="li">
                <code>depends_on: [db]</code> allein wartet nur, bis der Container läuft.
              </Fragment>
              <Fragment as="li">
                <code>condition: service_healthy</code> wartet auf den grünen Health
                Check.
              </Fragment>
              <Fragment as="li">
                Sonst stürzt eine App, die sich beim Start verbindet, beim ersten{' '}
                <code>up</code> ab: Postgres richtet sich da noch ein.
              </Fragment>
            </ul>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
