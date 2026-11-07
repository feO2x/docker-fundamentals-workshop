import { Fragment, Slide } from '@revealjs/react'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { Flow } from '../diagrams/Flow'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'nuke-extensions'

// Vereinfacht: zeigt das Prinzip, nicht die Dateien eines bestimmten Projekts.
const hostDockerfile = [
  'FROM mcr.microsoft.com/dotnet/aspnet:10.0',
  'WORKDIR /app',
  'COPY publish/ .',
  'ENTRYPOINT ["dotnet", "MeinService.dll"]',
]

const labels = [
  '$ docker image inspect meinservice:1.4.2 \\',
  "    --format '{{json .Config.Labels}}'",
  '{',
  '  "org.opencontainers.image.title": "MeinService",',
  '  "org.opencontainers.image.version": "1.4.2",',
  '  "org.opencontainers.image.revision": "3f9c2e1…",',
  '  "org.opencontainers.image.source": "https://…/meinservice",',
  '  "org.opencontainers.image.created": "2026-11-07T09:15:00Z"',
  '}',
]

/** Block „Praxisbeispiel: NukeExtensions“: auf dem Host bauen, nur DLLs kopieren, OCI-Labels. */
export function NukeExtensionsBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Gebaut wird vor dem Dockerfile">
          <Flow
            animate
            steps={[
              {
                title: 'Build-Server',
                text: 'NukeExtensions: dotnet test, dotnet publish',
              },
              { title: 'publish/', text: 'die fertigen DLLs' },
              { title: 'Image', text: 'Runtime-Image plus DLLs', accent: true },
            ]}
            arrows={['Nuke', 'docker build']}
          />
          <Fragment as="p" className="takeaway">
            Beim Multi-Stage-Build kompiliert der Container. Bei uns kompiliert der
            Build-Server, und das Dockerfile packt nur noch ein.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Das Dockerfile wird winzig">
          <StepCode language="dockerfile" lines={hostDockerfile} steps="1|3" />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Eine einzige Stage auf dem Runtime-Image. Kein SDK, kein Restore, kein
                Quellcode im Kontext.
              </li>
              <li>
                <code>COPY publish/ .</code> erwartet, dass <code>dotnet publish</code>{' '}
                vorher gelaufen ist. Ohne den Build-Server ist das Dockerfile allein
                nutzlos.
              </li>
            </Fragment>
          </WhenDeckReady>
          <p className="note">
            Vereinfacht - so sieht das Prinzip aus, nicht ein bestimmtes Projekt.
          </p>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Labels nach OCI-Standard">
          <StepCode
            language="shell"
            lines={labels}
            steps="1-9|5-6"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Labels sind Schlüssel-Wert-Paare im Image. Die Namen unter{' '}
                <code>org.opencontainers.image.*</code> sind standardisiert, jedes
                Werkzeug versteht sie.
              </li>
              <li>
                Der Build setzt sie mit <code>LABEL</code> oder{' '}
                <code>docker build --label</code>. So verrät jedes Image Version und
                Commit, aus dem es stammt.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Schneller - aber nicht umsonst">
          <div className="columns">
            <div className="column">
              <p className="column__label column__label--accent">Was es bringt</p>
              <ul className="points">
                <li>Der Build nutzt den NuGet-Cache und baut inkrementell.</li>
                <li>Tests laufen einmal, bevor überhaupt ein Image entsteht.</li>
                <li>Kein SDK-Image in der Pipeline, das Packen dauert Sekunden.</li>
              </ul>
            </div>
            <Fragment as="div" className="column">
              <p className="column__label">Was es kostet</p>
              <ul className="points">
                <li>Das Dockerfile beschreibt den Build nicht mehr vollständig.</li>
                <li>
                  Der Build-Server braucht das passende SDK - „läuft bei mir“ ist zurück.
                </li>
                <li>
                  <code>dotnet publish</code> muss zur Plattform des Images passen, z. B.{' '}
                  <code>linux-x64</code>.
                </li>
              </ul>
            </Fragment>
          </div>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
