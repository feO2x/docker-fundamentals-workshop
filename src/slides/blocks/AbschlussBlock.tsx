import { Fragment, Slide } from '@revealjs/react'
import type { ReactNode } from 'react'
import brokenDockerfile from '../../../exercises/zaehler/Dockerfile?raw'
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

const brokenLines = dockerfileLines(brokenDockerfile)
const fixedLines = dockerfileLines(fixedDockerfile)

// So startet der Kollege den Zähler; das Volume fehlt.
const brokenRun = 'docker run -d --name zaehler -p 8080:8080 zaehler:1.0'
const fixedRun =
  'docker run -d --name zaehler -p 8080:8080 -v zaehler-daten:/app/daten zaehler:1.0'

// Gegen den Workflow exercises.yml geprüft (Abschnitte „Abschlussübung“).
const fixes: { symptom: ReactNode; cause: ReactNode; fix: ReactNode }[] = [
  {
    symptom: 'Seite nicht erreichbar',
    cause: (
      <>
        <code>ASPNETCORE_URLS=http://localhost:5000</code>: Die App lauscht nur im
        Container selbst
      </>
    ),
    fix: (
      <>
        die <code>ENV</code>-Zeile streichen, das Image lauscht von sich aus auf 8080
      </>
    ),
  },
  {
    symptom: 'Zähler nach rm wieder bei 1',
    cause: (
      <>
        <code>besuche.txt</code> liegt in der Schicht des Containers
      </>
    ),
    fix: (
      <>
        <code>-v zaehler-daten:/app/daten</code> beim Start
      </>
    ),
  },
  {
    symptom: 'Image 1,3 GB groß',
    cause: 'SDK und Quellcode stecken im fertigen Image',
    fix: (
      <>
        Multi-Stage-Build mit <code>aspnet:10.0</code> als letzter Stage
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
        erst <code>Zaehler.csproj</code> kopieren und <code>dotnet restore</code>, dann
        den Rest
      </>
    ),
  },
]

/** Block „Abschlussübung“: ein schlecht containerisierter Besucherzähler. */
export function AbschlussBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Euer Auftrag">
          <div className="columns columns--wide-first">
            <StepCode
              language="dockerfile"
              lines={brokenLines}
              steps={false}
              className="code--dense"
            />
            <p className="note">
              Ein Kollege hat den Besucherzähler in <code>exercises/zaehler</code>{' '}
              containerisiert und startet ihn so:
            </p>
          </div>
          <StepCode lines={[brokenRun]} className="code--small" />
          <ul className="points">
            <li>
              <code>http://localhost:8080</code> soll „Moin! Ihr seid Besucher Nr. …“
              zeigen, und der Zähler soll ein <code>docker rm</code> überleben.
            </li>
            <li>
              Im Image hat kein SDK und kein Quellcode etwas verloren, und eine Änderung
              an <code>Program.cs</code> darf kein neues <code>dotnet restore</code>{' '}
              auslösen.
            </li>
          </ul>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Abschlussübung: Repariert den Zähler"
        tasks={[
          <>
            Baut das Image des Kollegen als <code>zaehler:1.0</code>, startet es mit
            seinem Kommando und probiert es im Browser aus.
          </>,
          'Findet die vier Probleme und repariert Dockerfile und Startkommando.',
          <>
            Prüft: Zählt die Seite hoch? Zählt sie nach <code>docker rm -f zaehler</code>{' '}
            und neuem Start weiter? Wie groß ist das Image?
          </>,
          <>
            Pusht das Image als <code>localhost:5050/zaehler:1.0</code> in eure Registry.
            Läuft sie nicht mehr: <code>{REGISTRY_RUN}</code>
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Bei jedem Problem</span>
          Was sagen <code>docker logs zaehler</code>, <code>docker ps</code> und{' '}
          <code>docker image ls</code>?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Falls ihr feststeckt">
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt>Seite nicht erreichbar</dt>
              <dd>
                Auf welcher Adresse lauscht die App laut <code>docker logs</code>? Und wer
                ist <code>localhost</code>, wenn man im Container fragt?
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>Zähler beginnt neu</dt>
              <dd>
                Wohin schreibt die App? Ein Blick mit <code>docker exec</code> in{' '}
                <code>/app</code> hilft.
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
                <col style={{ width: '22%' }} />
                <col style={{ width: '37%' }} />
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
            <p className="note">
              Den ersten Hinweis liefert die App selbst: <code>docker logs</code> zeigt{' '}
              <code>Now listening on: http://localhost:5000</code>.
            </p>
          </Spoiler>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Das reparierte Setup">
          <div className="columns columns--wide-first">
            <StepCode
              language="dockerfile"
              lines={fixedLines}
              steps={false}
              className="code--dense"
            />
            <ul className="points">
              <li>
                Das Image ist 342 MB groß statt 1,3 GB, so groß wie aspnet:10.0 selbst.
              </li>
              <li>
                Nach einer Änderung an <code>Program.cs</code> zeigt der Build{' '}
                <code>CACHED</code> beim Restore.
              </li>
            </ul>
          </div>
          <StepCode
            lines={[
              fixedRun,
              'docker tag zaehler:1.0 localhost:5050/zaehler:1.0',
              'docker push localhost:5050/zaehler:1.0',
            ]}
            steps={false}
            className="code--dense"
          />
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
