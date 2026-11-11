import { Fragment, Slide } from '@revealjs/react'
import singleStageDockerfile from '../../../exercises/hallo-dotnet/Dockerfile?raw'
import multiStageDockerfile from '../../../exercises/loesungen/hallo-dotnet.Dockerfile?raw'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { MultiStage } from '../diagrams/MultiStage'
import { dockerfileLines, lineOf } from '../dockerfile'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'multi-stage'

const singleStageLines = dockerfileLines(singleStageDockerfile)
const multiStageLines = dockerfileLines(multiStageDockerfile)

// Schritte: die Build-Stage, die letzte Stage, darin COPY --from.
const at = (prefix: string) => lineOf(multiStageLines, prefix)
const lastFrom = multiStageLines.findLastIndex((line) => line.startsWith('FROM')) + 1
const multiStageSteps = `1-${lastFrom - 2}|${lastFrom}-${multiStageLines.length}|${at('COPY --from')}`

// Größen aus dem Workflow exercises.yml (docker image ls, Docker 29, linux/amd64).
const sizes = [
  { image: 'hallo:einstufig', disk: '1,3 GB', content: '354 MB' },
  { image: 'hallo:mehrstufig', disk: '301 MB', content: '85 MB' },
  { image: 'hallo:alpine', disk: '138 MB', content: '43 MB' },
  {
    image: 'hallo:noble-chiseled',

    disk: '141 MB',
    content: '44 MB',
  },
]

/** Block „Multi-Stage-Builds“: Bauen und Ausführen trennen, Basis-Image wählen. */
export function MultiStageBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Bauen ist nicht Ausführen">
          <ul className="cards cards--three">
            <li className="card">
              <strong>SDK · 1,3 GB</strong>
              <code>dotnet/sdk:10.0</code>
              <span>Compiler, MSBuild, NuGet, Templates - alles zum Bauen</span>
            </li>
            <li className="card">
              <strong>Runtime · 301 MB</strong>
              <code>dotnet/runtime:10.0</code>
              <span>nur die .NET-Laufzeit - alles zum Ausführen</span>
            </li>
            <li className="card">
              <strong>ASP.NET Core · 342 MB</strong>
              <code>dotnet/aspnet:10.0</code>
              <span>Laufzeit plus ASP.NET Core, für Webanwendungen</span>
            </li>
          </ul>
          <Fragment as="p" className="takeaway">
            Auf dem Server braucht ihr nur die Laufzeit. Alles andere ist Ballast - und
            Angriffsfläche.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Einstufig: alles in einem Image">
          <StepCode language="dockerfile" lines={singleStageLines} steps={false} />
          <ul className="points">
            <Fragment as="li">
              Funktioniert und ihr braucht trotzdem kein SDK auf eurem Rechner.
            </Fragment>
            <Fragment as="li">
              Aber im fertigen Image stecken das ganze SDK, euer Quellcode und alle
              Zwischenergebnisse des Builds: 1,3 GB für eine Konsolen-App.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Mehrstufig: bauen, dann umziehen">
          <div className="columns columns--code">
            <StepCode
              language="dockerfile"
              lines={multiStageLines}
              steps={multiStageSteps}
              className="code--small"
            />
            <WhenDeckReady>
              <dl className="legend legend--compact">
                <div className="legend__row">
                  <dt>AS build</dt>
                  <dd>Die erste Stage bekommt einen Namen.</dd>
                </div>
                <Fragment as="div" className="legend__row" index={0}>
                  <dt>FROM …</dt>
                  <dd>Das zweite FROM beginnt ein neues, leeres Image.</dd>
                </Fragment>
                <Fragment as="div" className="legend__row" index={1}>
                  <dt>--from</dt>
                  <dd>COPY holt Dateien aus einer anderen Stage.</dd>
                </Fragment>
              </dl>
            </WhenDeckReady>
          </div>
          <p className="note">
            Erst nur die <code>.csproj</code> und <code>dotnet restore</code>, dann der
            Rest: So bleibt das Restore im Cache, solange sich die Pakete nicht ändern.
          </p>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Nur die letzte Stage zählt">
          <MultiStage />
          <Fragment as="p" className="takeaway">
            Ins Image kommt nur, was die letzte Stage enthält. SDK und Quellcode bleiben
            beim Build zurück: 301 MB statt 1,3 GB.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Welches Basis-Image?">
          <table className="compare">
            <thead>
              <tr>
                <th>Tag von dotnet/runtime</th>
                <th>Linux</th>
                <th>Was ihr wissen müsst</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10.0</td>
                <td>Ubuntu 24.04</td>
                <td>der Standard, mit Shell und apt</td>
              </tr>
              <Fragment as="tr">
                <td>10.0-alpine</td>
                <td>Alpine</td>
                <td>
                  klein, aber mit <code>musl</code> statt <code>glibc</code>: Manche
                  native Bibliothek läuft dort nicht
                </td>
              </Fragment>
              <Fragment as="tr">
                <td>10.0-noble-chiseled</td>
                <td>Ubuntu, ausgedünnt</td>
                <td>
                  klein, ohne Shell und Paketmanager, läuft von sich aus als app.{' '}
                  <code>docker exec … bash</code> geht nicht mehr
                </td>
              </Fragment>
            </tbody>
          </table>
          <Fragment as="p" className="note">
            Weniger im Image heißt weniger zu patchen. Chiseled ist für Produktion eine
            gute Wahl, solange ihr zum Debuggen keine Shell braucht.
          </Fragment>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Vom Riesen zum Zwerg"
        tasks={[
          <>
            Baut in <code>exercises/hallo-dotnet</code> das vorhandene einstufige
            Dockerfile als <code>hallo:einstufig</code> und startet es.
          </>,
          <>
            Schreibt ein <code>Dockerfile.mehrstufig</code> mit einer Build-Stage auf{' '}
            <code>sdk:10.0</code> und einer letzten Stage auf <code>runtime:10.0</code>,
            die als <code>app</code> läuft: <code>USER $APP_UID</code>. Baut es mit{' '}
            <code>-f</code> als <code>hallo:mehrstufig</code>.
          </>,
          <>
            Vergleicht die Größen mit <code>docker image ls hallo</code>.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Bonus</span>
          Nehmt <code>runtime:10.0-alpine</code> oder <code>10.0-noble-chiseled</code> als
          letzte Stage. Was sagt die App über ihr Betriebssystem, und wie groß ist das
          Image?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Lösung: Vom Riesen zum Zwerg">
          <Spoiler>
            <div className="columns">
              <StepCode
                language="dockerfile"
                lines={multiStageLines}
                steps={false}
                className="code--dense"
              />
              <table className="compare">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Disk</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size) => (
                    <tr key={size.image}>
                      <td>{size.image}</td>
                      <td>{size.disk}</td>
                      <td>{size.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">
              Die App meldet <code>Ubuntu 24.04.5 LTS</code>, auf Alpine{' '}
              <code>Alpine Linux v3.24</code>. Sie liest das aus{' '}
              <code>/etc/os-release</code> des Images. Bauen:{' '}
              <code>docker build -f Dockerfile.mehrstufig -t hallo:mehrstufig .</code>
            </p>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
