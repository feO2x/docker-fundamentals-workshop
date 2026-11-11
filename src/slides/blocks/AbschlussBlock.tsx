import { Fragment, Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import brokenCompose from '../../../exercises/zaehler/compose.yaml?raw'
import brokenDockerfile from '../../../exercises/zaehler/Dockerfile?raw'
import fixedCompose from '../../../exercises/loesungen/zaehler.compose.yaml?raw'
import fixedDockerfile from '../../../exercises/loesungen/zaehler.Dockerfile?raw'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { dockerfileLines } from '../dockerfile'
import { ExerciseSlide } from '../ExerciseSlide'
import { REGISTRY_RUN } from '../images'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'

const BLOCK_ID = 'abschlussuebung'

const brokenDockerfileLines = dockerfileLines(brokenDockerfile)
const brokenComposeLines = dockerfileLines(brokenCompose)
const fixedDockerfileLines = dockerfileLines(fixedDockerfile)
const fixedComposeLines = dockerfileLines(fixedCompose)

// Die reparierte compose.yaml ist zu lang für eine Spalte: links die App, rechts die
// Datenbank samt Volumes.
const dbStart = fixedComposeLines.indexOf('  db:')
const fixedAppLines = fixedComposeLines.slice(0, dbStart - 1)
const fixedDbLines = fixedComposeLines.slice(dbStart)

// Gegen den Workflow exercises.yml geprüft (Abschnitte „Abschlussübung“), in der
// Reihenfolge, in der die Probleme beim Ausprobieren auffallen.
const fixes: { symptom: ReactNode; cause: ReactNode; fix: ReactNode }[] = [
  {
    symptom: (
      <>
        <code>127.0.0.1:5432</code> nicht erreichbar
      </>
    ),
    cause: (
      <>
        <code>localhost</code> ist der Container der App
      </>
    ),
    fix: (
      <>
        <code>Host=db</code>, der Name des Dienstes
      </>
    ),
  },
  {
    symptom: 'App beendet sich beim ersten Start',
    cause: (
      <>
        <code>depends_on</code> wartet nur auf den Start von <code>db</code>
      </>
    ),
    fix: (
      <>
        <code>healthcheck</code> und <code>condition: service_healthy</code>
      </>
    ),
  },
  {
    symptom: (
      <>
        Zähler nach <code>down</code> wieder bei 1
      </>
    ),
    cause: 'Postgres schreibt in ein anonymes Volume',
    fix: (
      <>
        <code>db-daten:/var/lib/postgresql</code>
      </>
    ),
  },
  {
    symptom: 'Image 1,4 GB groß',
    cause: 'SDK und Quellcode im fertigen Image',
    fix: (
      <>
        Multi-Stage mit <code>aspnet:10.0</code> am Ende
      </>
    ),
  },
  {
    symptom: 'Restore bei jeder Änderung',
    cause: (
      <>
        <code>COPY . .</code> vor dem Restore
      </>
    ),
    fix: (
      <>
        erst die <code>.csproj</code> kopieren und restoren
      </>
    ),
  },
  {
    symptom: 'App läuft als root',
    cause: (
      <>
        kein <code>USER</code> im Dockerfile
      </>
    ),
    fix: (
      <>
        <code>USER $APP_UID</code> in der letzten Stage
      </>
    ),
  },
]

/** Block „Abschlussübung“: ein schlecht aufgesetzter Besucherzähler mit Datenbank. */
export function AbschlussBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Das Setup des Kollegen">
          <div className="columns columns--code">
            <StepCode
              language="yaml"
              lines={brokenComposeLines}
              steps={false}
              className="code--dense"
            />
            <StepCode
              language="dockerfile"
              lines={brokenDockerfileLines}
              steps={false}
              className="code--dense"
            />
          </div>
          <p className="note">
            Ein Kollege hat den Besucherzähler in <code>exercises/zaehler</code> samt
            PostgreSQL aufgesetzt und startet ihn mit{' '}
            <code>docker compose up -d --build</code>.
          </p>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Was am Ende klappen soll">
          <ul className="points">
            <li>
              <code>http://localhost:8080</code> zeigt „Moin! Ihr seid Besucher Nr. …“.
            </li>
            <li>
              Der Zähler überlebt <code>docker compose down</code> und <code>up</code>.
            </li>
            <li>
              Nach <code>docker compose down -v</code> startet alles beim ersten{' '}
              <code>up</code>.
            </li>
            <li>Im Image steckt kein SDK und kein Quellcode.</li>
            <li>
              Eine Änderung an <code>Program.cs</code> löst kein neues{' '}
              <code>dotnet restore</code> aus.
            </li>
            <li>Die App läuft nicht als root.</li>
          </ul>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Abschlussübung: Repariert den Zähler"
        tasks={[
          <>
            Startet das Setup des Kollegen in <code>exercises/zaehler</code> mit{' '}
            <code>docker compose up -d --build</code> und probiert es im Browser aus.
          </>,
          <>
            Findet die sechs Probleme und repariert <code>Dockerfile</code> und{' '}
            <code>compose.yaml</code>.
          </>,
          'Hakt die Liste von eben ab. Wie groß ist das Image am Ende?',
        ]}
      >
        <p className="question">
          <span className="question__label">Bei jedem Problem</span>
          Was sagen <code>docker compose ps -a</code>,{' '}
          <code>docker compose logs zaehler</code> und <code>docker image ls</code>?
        </p>
        <p className="question">
          <span className="question__label">Wer fertig ist</span>
          Ergänzt beim Dienst <code>zaehler</code> die Zeile{' '}
          <code>image: localhost:5050/zaehler:1.0</code> und pusht mit{' '}
          <code>docker compose push</code>. Läuft die Registry nicht mehr:{' '}
          <code>{REGISTRY_RUN}</code>
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Falls ihr feststeckt">
          <dl className="legend legend--auto legend--compact">
            <Fragment as="div" className="legend__row">
              <dt>127.0.0.1:5432</dt>
              <dd>
                Wer ist <code>localhost</code>, wenn man im Container fragt? Und wie heißt
                die Datenbank im Netzwerk des Projekts?
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>172.…:5432</dt>
              <dd>
                Die Datenbank läuft, ist aber noch nicht bereit. Worauf wartet{' '}
                <code>depends_on</code>?
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>Zähler beginnt neu</dt>
              <dd>
                Wo speichert Postgres seine Daten? <code>docker volume ls</code> zeigt,
                was jedes <code>up</code> neu anlegt.
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>dependency failed</dt>
              <dd>
                Was sagt <code>docker compose logs db</code>? Ab Postgres 18 gehört das
                Volume nach <code>/var/lib/postgresql</code>.
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>Image zu groß</dt>
              <dd>Welches FROM landet im fertigen Image?</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>Restore bei jeder Änderung</dt>
              <dd>Ab welcher Anweisung baut Docker neu, wenn sich Program.cs ändert?</dd>
            </Fragment>
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Abschlussübung: So geht's">
          <Spoiler>
            <table className="solutions">
              <colgroup>
                <col style={{ width: '1em' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '32%' }} />
                <col />
              </colgroup>
              <tbody>
                {fixes.map((fix, index) => (
                  <tr key={index}>
                    <td className="solutions__number">{index + 1}</td>
                    <td>{fix.symptom}</td>
                    <td>{fix.cause}</td>
                    <td>{fix.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Spoiler>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Das reparierte Dockerfile">
          <div className="columns columns--code">
            <StepCode
              language="dockerfile"
              lines={fixedDockerfileLines}
              steps={false}
              className="code--small"
            />
            <ul className="points">
              <li>
                Das Image ist 372 MB groß statt 1,4 GB: <code>aspnet:10.0</code> plus App
                und Npgsql.
              </li>
              <li>
                Nach einer Änderung an <code>Program.cs</code> zeigt der Build{' '}
                <code>CACHED</code> beim Restore.
              </li>
              <li>
                Die App läuft als <code>app</code>. Ihre Daten liegen in der Datenbank.
              </li>
            </ul>
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Die reparierte compose.yaml">
          <div className="columns">
            <StepCode
              language="yaml"
              lines={fixedAppLines}
              steps={false}
              className="code--dense"
            />
            <StepCode
              language="yaml"
              lines={fixedDbLines}
              steps={false}
              className="code--dense"
            />
          </div>
          <ul className="points">
            <li>
              Statt Health Check hilft auch <code>restart: on-failure</code>: Compose
              startet die App neu, bis die Datenbank bereit ist.
            </li>
            <li>
              <code>docker compose push</code> pusht nur, was Compose selbst baut, nicht{' '}
              <code>postgres:18</code>.
            </li>
          </ul>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
