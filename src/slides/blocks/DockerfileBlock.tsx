import { Fragment, Slide } from '@revealjs/react'
import bannerDockerfile from '../../../exercises/banner/Dockerfile?raw'
import wetterDockerfile from '../../../exercises/loesungen/wetter.Dockerfile?raw'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { Flow } from '../diagrams/Flow'
import { dockerfileLines, lineOf } from '../dockerfile'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'dockerfile'

const bannerLines = dockerfileLines(bannerDockerfile)
const wetterLines = dockerfileLines(wetterDockerfile)

// Ein Schritt pro Anweisung; RUN geht über drei Zeilen.
const at = (prefix: string) => lineOf(bannerLines, prefix)
const bannerSteps = [
  `${at('FROM')}`,
  `${at('RUN')}-${at('WORKDIR') - 1}`,
  `${at('WORKDIR')}`,
  `${at('COPY')}`,
  `${at('ENV')}`,
  `${at('ENTRYPOINT')}`,
  `${at('CMD')}`,
].join('|')

// Die Zeilen von RUN, für die Folie über lange Befehle.
const runLines = bannerLines.slice(at('RUN') - 1, at('WORKDIR') - 1)

// Ausgabe von `docker run --rm banner` aus dem Workflow exercises.yml.
const moinBanner = [
  ' __  __       _       ',
  '|  \\/  | ___ (_)_ __  ',
  "| |\\/| |/ _ \\| | '_ \\ ",
  '| |  | | (_) | | | | |',
  '|_|  |_|\\___/|_|_| |_|',
]

/** Eine Anweisung des Dockerfiles mit Erklärung, als Zeile der Legende. */
const instructions = [
  { name: 'FROM', text: 'Basis-Image, darauf baut alles auf' },
  { name: 'RUN', text: 'Kommando beim Bauen, z. B. apt-get' },
  { name: 'WORKDIR', text: 'Arbeitsverzeichnis, wird angelegt' },
  { name: 'COPY', text: 'Dateien von euch ins Image' },
  { name: 'ENV', text: 'Umgebungsvariable mit Standardwert' },
  { name: 'ENTRYPOINT', text: 'das Programm beim Start' },
  { name: 'CMD', text: 'seine Standard-Argumente' },
]

/** Block „Das erste Dockerfile“: Anweisungen, ENTRYPOINT/CMD, Build und Kontext. */
export function DockerfileBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Vom Dockerfile zum Container">
          <Flow
            animate
            steps={[
              { title: 'Dockerfile', text: 'das Rezept: eine Anweisung pro Zeile' },
              { title: 'Image', text: 'das Ergebnis, mit Namen und Tag' },
              { title: 'Container', text: 'wie bisher', accent: true },
            ]}
            arrows={['docker build', 'docker run']}
          />
          <Fragment as="p" className="takeaway">
            Statt einer Installationsanleitung im Wiki schreibt ihr ein Rezept, das Docker
            bei jedem Build gleich ausführt.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Dockerfile, Zeile für Zeile">
          <div className="columns columns--code">
            <StepCode
              language="dockerfile"
              lines={bannerLines}
              steps={bannerSteps}
              className="code--small"
            />
            <dl className="legend legend--auto legend--compact">
              <div className="legend__row">
                <dt>{instructions[0].name}</dt>
                <dd>{instructions[0].text}</dd>
              </div>
              <WhenDeckReady>
                {/* Jede Zeile erscheint mit ihrem Code-Schritt (Index ab 0, siehe WhenDeckReady). */}
                {instructions.slice(1).map((instruction, index) => (
                  <Fragment
                    key={instruction.name}
                    as="div"
                    className="legend__row"
                    index={index}
                  >
                    <dt>{instruction.name}</dt>
                    <dd>{instruction.text}</dd>
                  </Fragment>
                ))}
              </WhenDeckReady>
            </dl>
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Lange RUN-Befehle">
          <StepCode language="dockerfile" lines={runLines} steps={false} />
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt>\</dt>
              <dd>Die Zeile geht in der nächsten weiter. Lesbar, aber ein Befehl.</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>&amp;&amp;</dt>
              <dd>nur weiter, wenn der Schritt davor geklappt hat</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>-y</dt>
              <dd>Beim Bauen sitzt niemand da, der „Ja“ tippt.</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>--no-install-recommends</dt>
              <dd>nur das Paket selbst, ohne empfohlene Extras</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>rm -rf /var/lib/apt/lists/*</dt>
              <dd>
                Die Paketlisten braucht zur Laufzeit niemand. Warum im selben RUN, zeigt
                der nächste Block.
              </dd>
            </Fragment>
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="ENTRYPOINT und CMD">
          <table className="compare">
            <thead>
              <tr>
                <th>Ihr startet</th>
                <th>Im Container läuft</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>docker run --rm banner</code>
                </td>
                <td>
                  <code>./banner.sh Moin</code>
                </td>
              </tr>
              <Fragment as="tr">
                <td>
                  <code>docker run --rm banner Hallo Welt</code>
                </td>
                <td>
                  <code>./banner.sh Hallo Welt</code>
                </td>
              </Fragment>
              <Fragment as="tr">
                <td>
                  <code>docker run --rm -e SCHRIFT=slant banner Hallo</code>
                </td>
                <td>
                  <code>./banner.sh Hallo</code>, mit <code>SCHRIFT=slant</code>
                </td>
              </Fragment>
            </tbody>
          </table>
          <Fragment as="p" className="takeaway">
            ENTRYPOINT ist das Programm. CMD sind seine Standard-Argumente, und alles
            hinter dem Image-Namen ersetzt sie.
          </Fragment>
          <Fragment as="p" className="note">
            Schreibt beide in eckigen Klammern. Dann startet Docker das Programm direkt
            als PID 1, ohne Shell dazwischen.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="docker build">
          <StepCode lines={['docker build -t banner:1.0 -t banner:latest .']} />
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt>-t banner:1.0</dt>
              <dd>Name und Tag des Images. Mehrere -t geben ihm mehrere Namen.</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>.</dt>
              <dd>
                der Build-Kontext: dieser Ordner. Darin sucht Docker das{' '}
                <code>Dockerfile</code> und alles, was <code>COPY</code> kopiert.
              </dd>
            </Fragment>
          </dl>
          <Fragment as="div" className="columns columns--wide-first">
            <StepCode
              language="plaintext"
              lines={['$ docker run --rm banner', ...moinBanner]}
              steps={false}
              className="code--art"
            />
            <p className="note">
              Ein anderes Dockerfile wählt ihr mit <code>-f</code>, z. B.{' '}
              <code>-f Dockerfile.test</code>.
            </p>
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Der Build-Kontext und .dockerignore">
          <ul className="points">
            <li>
              Docker schickt den ganzen Kontext-Ordner an den Builder. <code>COPY</code>{' '}
              kann nur Dateien daraus kopieren, nichts von außerhalb.
            </li>
            <Fragment as="li">
              Eine <code>.dockerignore</code> nimmt Dateien aus, wie eine{' '}
              <code>.gitignore</code>. Für .NET-Projekte gehören mindestens{' '}
              <code>bin/</code> und <code>obj/</code> hinein.
            </Fragment>
            <Fragment as="li">
              Das hält den Build schnell und verhindert, dass Dateien eures Rechners -
              oder Geheimnisse wie eine <code>.env</code> - im Image landen.
            </Fragment>
          </ul>
          <StepCode
            lines={['bin/', 'obj/', '.git/', '.env']}
            steps={false}
            className="code--small"
          />
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Ein Image für das Wetter"
        tasks={[
          <>
            In <code>exercises/wetter</code> liegt <code>wetter.sh</code>. Es zeigt das
            Wetter einer Stadt und braucht dafür <code>curl</code> und <code>jq</code>.
          </>,
          <>
            Schreibt daneben ein <code>Dockerfile</code>: auf Basis von{' '}
            <code>ubuntu:24.04</code>, mit <code>curl</code>, <code>jq</code> und{' '}
            <code>ca-certificates</code>, mit dem Skript als ENTRYPOINT und Regensburg als
            Standard-Stadt.
          </>,
          <>
            Baut es als <code>wetter:1.0</code> und <code>wetter:latest</code>.
          </>,
          <>
            Startet es ohne Argument, mit eurer Stadt und mit{' '}
            <code>-e EINHEIT=fahrenheit</code>.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Bonus</span>
          Was passiert, wenn ihr <code>ca-certificates</code> weglasst? Und wenn ihr{' '}
          <code>apt-get update</code> vergesst?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Falls ihr feststeckt">
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt>Unable to locate package</dt>
              <dd>
                Hat <code>apt-get update</code> vorher die Paketlisten geholt?
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>permission denied</dt>
              <dd>
                Ist das Skript ausführbar? <code>COPY --chmod=755</code> setzt die Rechte
                gleich beim Kopieren.
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>no such file or directory</dt>
              <dd>
                Stimmt der Pfad im ENTRYPOINT zum <code>WORKDIR</code>? Unter Windows: Hat
                das Skript Windows-Zeilenenden?
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>curl: (77)</dt>
              <dd>
                <code>curl</code> findet keine Zertifikate für HTTPS:{' '}
                <code>ca-certificates</code> fehlt.
              </dd>
            </Fragment>
          </dl>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Lösung: Ein Image für das Wetter">
          <Spoiler>
            <StepCode
              language="dockerfile"
              lines={wetterLines}
              steps={false}
              className="code--small"
            />
            <p className="note">
              Bauen mit <code>docker build -t wetter:1.0 -t wetter:latest .</code>, dann
              z. B. <code>docker run --rm wetter München</code> oder{' '}
              <code>docker run --rm -e EINHEIT=fahrenheit wetter Hamburg</code>.
            </p>
            <p className="note">
              Ausgabe z. B. <code>Regensburg: 2.5 °C, Wind 10.2 km/h</code>. Mehrere
              Wörter hinter dem Image werden zur Stadt: <code>wetter Bad Tölz</code>.
            </p>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
