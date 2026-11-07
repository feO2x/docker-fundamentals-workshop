import { Fragment, Slide } from '@revealjs/react'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { DependencyLayers } from '../diagrams/DependencyLayers'
import { ImageStacks } from '../diagrams/ImageStacks'
import { ExerciseSlide } from '../ExerciseSlide'
import { DOTNET_SDK, PYTHON_312, PYTHON_313 } from '../images'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'warum-docker'

const problems = [
  {
    title: 'Versionskonflikte',
    text: 'Anwendung A braucht Python 3.12, Anwendung B Python 3.13 - auf demselben Server.',
  },
  {
    title: 'Veraltete Anleitungen',
    text: 'Die Wiki-Seite zur Installation stimmt beim fünften Server schon nicht mehr.',
  },
  {
    title: 'Schleichende Unterschiede',
    text: 'Ein Update hier, ein Hotfix da: Nach einem Jahr gleicht kein Server dem anderen.',
  },
  {
    title: '„Bei mir läuft’s“',
    text: 'Auf eurem Rechner ist alles da, auf dem Server fehlt eine Kleinigkeit.',
  },
]

/** Ausgaben von `/etc/os-release` (PRETTY_NAME) der Übungs-Images. */
const osReleases = [
  { image: PYTHON_312, os: 'Debian GNU/Linux 13 (trixie)' },
  { image: PYTHON_313, os: 'Debian GNU/Linux 13 (trixie)' },
  { image: DOTNET_SDK, os: 'Ubuntu 24.04.5 LTS' },
]

/** Block „Warum Docker?“: Abhängigkeiten, Images als User Space, erstes docker run. */
export function WarumDockerBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Was eure Anwendung alles braucht">
          <DependencyLayers />
          <Fragment as="p" className="takeaway">
            Auf eurem Rechner hat das irgendwann jemand installiert. Auf dem Server muss
            es genauso da sein.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Jeder Server ein Unikat">
          <ul className="cards">
            {problems.map((problem) => (
              <li key={problem.title} className="card">
                <strong>{problem.title}</strong>
                <span>{problem.text}</span>
              </li>
            ))}
          </ul>
          <Fragment as="p" className="takeaway">
            Das Problem ist selten die Anwendung selbst, sondern alles, was drumherum
            installiert sein muss.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Image bringt alles mit">
          <p className="note">
            Aus Linux Fundamentals kennt ihr das: Container teilen sich den Kernel des
            Hosts.
          </p>
          <ImageStacks />
          <Fragment as="p" className="takeaway">
            Den ganzen Rest, den User Space, bringt das Image mit. Darum laufen Debian und
            Ubuntu nebeneinander auf demselben Kernel.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Installieren heißt jetzt docker run">
          <StepCode
            language="shell"
            lines={[
              `$ docker run --rm ${PYTHON_312} python --version`,
              'Python 3.12.16',
              `$ docker run --rm ${PYTHON_313} python --version`,
              'Python 3.13.18',
            ]}
            steps="1-2|3-4"
          />
          <WhenDeckReady>
            <Fragment as="dl" className="legend legend--auto">
              <dt>--rm</dt>
              <dd>Container danach wieder löschen, es bleibt nichts zurück</dd>
              <dt>{PYTHON_312}</dt>
              <dd>das Image: Python samt dem Linux darunter</dd>
              <dt>python --version</dt>
              <dd>das Kommando, das im Container läuft</dd>
            </Fragment>
            <Fragment as="p" className="note">
              Beim ersten Start lädt Docker das Image herunter, danach ist es sofort da.
              Zwei Python-Versionen, nichts installiert, kein Konflikt.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ausliefern ist dasselbe Kommando">
          <div className="columns columns--wide-first">
            <div className="column">
              <p className="column__label">Ohne Image</p>
              <StepCode
                lines={[
                  '# laut Wiki-Seite, Stand März',
                  'sudo add-apt-repository ppa:dotnet/backports',
                  'sudo apt-get install aspnetcore-runtime-10.0',
                  'sudo cp -r publish/ /opt/app/',
                  'sudo cp app.service /etc/systemd/system/',
                  'sudo systemctl enable --now app',
                ]}
                steps={false}
                className="code--small"
              />
            </div>
            <Fragment as="div" className="column">
              <p className="column__label column__label--accent">Mit Image</p>
              <StepCode lines={['docker run firma/app:1.4']} className="code--small" />
            </Fragment>
          </div>
          <Fragment as="p" className="takeaway">
            Auf den Server muss nur noch Docker. Alles andere steckt im Image.
          </Fragment>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Ohne etwas zu installieren"
        tasks={[
          <>
            Startet Python 3.12 und 3.13 wie eben und lasst euch die Versionen ausgeben.
          </>,
          <>
            Startet eine Shell im .NET SDK und erstellt und startet darin eine App:
            <StepCode
              lines={[
                `docker run --rm -it ${DOTNET_SDK}`,
                'dotnet new console -o hallo && cd hallo && dotnet run',
              ]}
              steps={false}
              className="code--small"
            />
          </>,
          <>
            Lest in allen drei Images <code>/etc/os-release</code> und fragt mit{' '}
            <code>uname -r</code> nach dem Kernel. Statt <code>python --version</code>{' '}
            geht hinter dem Image jedes Kommando.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Auf welchem Linux laufen die Images, und wessen Kernel benutzen sie?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Lösung: Ohne etwas zu installieren">
          <Spoiler>
            <table className="solutions">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>
                    <code>/etc/os-release</code>
                  </th>
                  <th>
                    <code>uname -r</code>
                  </th>
                </tr>
              </thead>
              <tbody>
                {osReleases.map((release, index) => (
                  <tr key={release.image}>
                    <td className="solutions__path">
                      <code>{release.image}</code>
                    </td>
                    <td className="solutions__path">{release.os}</td>
                    {index === 0 && (
                      <td rowSpan={osReleases.length} className="solutions__merged">
                        überall derselbe: der Kernel eures Hosts
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="points">
              <li>
                Jedes Image bringt sein eigenes Linux mit. Unter Windows und macOS ist der
                Host die Linux-VM von Docker Desktop bzw. WSL 2.
              </li>
              <li>
                <code>dotnet run</code> hat eine App gebaut, ohne dass ihr ein SDK
                installiert habt. Nach <code>exit</code> hat <code>--rm</code> alles
                wieder weggeräumt.
              </li>
            </ul>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
