import { Fragment, Slide } from '@revealjs/react'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { LayerOrder } from '../diagrams/LayerOrder'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'layer-caching'

// Ausgaben aus dem Workflow exercises.yml, leicht gekürzt.
const history = [
  '$ docker history wetter:1.0',
  'CREATED BY                                      SIZE',
  'CMD ["Regensburg"]                              0B',
  'ENTRYPOINT ["./wetter.sh"]                      0B',
  'ENV EINHEIT=celsius                             0B',
  'COPY --chmod=755 wetter.sh . # buildkit         12.3kB',
  'WORKDIR /app                                    8.19kB',
  'RUN /bin/sh -c apt-get update     && apt-get…   11MB',
  '/bin/sh -c #(nop)  CMD ["/bin/bash"]            0B',
  '/bin/sh -c #(nop) ADD file:eed88e94d6aa7c9da…   87.6MB',
]

const cachedBuild = [
  '$ docker build -t wetter:1.0 .',
  ' => CACHED [2/4] RUN apt-get update && apt-get install -y …   0.0s',
  ' => CACHED [3/4] WORKDIR /app                                 0.0s',
  ' => [4/4] COPY --chmod=755 wetter.sh .                        0.0s',
]

/** Block „Layer & Caching“: Schichten, Build-Cache und die Reihenfolge im Dockerfile. */
export function LayerBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Jede Anweisung, eine Schicht">
          <StepCode
            language="shell"
            lines={history}
            steps="1-10|6-8|9-10"
            className="code--dense"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>RUN</code>, <code>COPY</code> und <code>WORKDIR</code> ändern
                Dateien und legen eine Schicht an. <code>ENV</code> und <code>CMD</code>{' '}
                sind nur Einstellungen, 0 Byte.
              </li>
              <li>
                Die untersten Schichten stammen aus <code>ubuntu:24.04</code>. Euer Image
                legt seine nur obendrauf.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Docker baut nur neu, was sich geändert hat">
          <StepCode
            language="shell"
            lines={cachedBuild}
            steps="1-4|2-3|4"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Für jede Anweisung prüft Docker: Gleiche Anweisung, gleiche Dateien,
                gleiche Schicht darunter? Dann nimmt es die Schicht aus dem Cache.
              </li>
              <li>
                Nach einer Änderung an <code>wetter.sh</code> baut es <code>COPY</code>{' '}
                neu - und jede Anweisung danach, weil ihre Grundlage jetzt eine andere
                ist.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Die Reihenfolge entscheidet">
          <LayerOrder />
          <Fragment as="p" className="takeaway">
            Was sich selten ändert, nach oben. Was sich oft ändert, nach unten.
          </Fragment>
          <Fragment as="p" className="note">
            Im Test mit schnellem Netz: 0,2 Sekunden gegen 8 Sekunden. Im Workshop-WLAN
            eher mehr.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="update und install gehören zusammen">
          <div className="columns">
            <div className="column">
              <p className="column__label">So nicht</p>
              <StepCode
                language="dockerfile"
                lines={[
                  'RUN apt-get update',
                  'RUN apt-get install -y curl jq',
                  'RUN rm -rf /var/lib/apt/lists/*',
                ]}
                steps={false}
                className="code--small"
              />
            </div>
            <div className="column">
              <p className="column__label column__label--accent">Sondern so</p>
              <StepCode
                language="dockerfile"
                lines={[
                  'RUN apt-get update \\',
                  '    && apt-get install -y curl jq \\',
                  '    && rm -rf /var/lib/apt/lists/*',
                ]}
                steps={false}
                className="code--small"
              />
            </div>
          </div>
          <ul className="points">
            <Fragment as="li">
              Die Schicht von <code>apt-get update</code> bleibt im Cache, auch Monate
              später. Kommt ein Paket dazu, sucht <code>install</code> in veralteten
              Listen und scheitert.
            </Fragment>
            <Fragment as="li">
              Eine spätere Schicht kann nichts mehr kleiner machen: Das <code>rm</code> im
              eigenen <code>RUN</code> versteckt die Listen nur, gespeichert bleiben sie.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Dem Cache zusehen"
        tasks={[
          <>
            Baut <code>wetter:1.0</code> noch einmal. Welche Schritte zeigen{' '}
            <code>CACHED</code>?
          </>,
          <>
            Ändert in <code>wetter.sh</code> den Text der Ausgabe und baut erneut. Schaut
            euch <code>docker history wetter:1.0</code> an.
          </>,
          <>
            Zieht im Dockerfile <code>COPY</code> vor das <code>RUN</code>, ändert das
            Skript noch einmal und messt den Build: <code>time docker build …</code> in
            Bash, <code>Measure-Command &#123; docker build … &#125;</code> in PowerShell.
          </>,
          'Stellt die alte Reihenfolge wieder her.',
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Wie viel länger dauert der Build mit der falschen Reihenfolge, und welcher
          Schritt kostet die Zeit?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Lösung: Dem Cache zusehen">
          <Spoiler>
            <table className="compare">
              <thead>
                <tr>
                  <th>Nach einer Änderung am Skript</th>
                  <th>neu gebaut</th>
                  <th>Dauer im Test</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>erst Pakete, dann Skript</td>
                  <td>
                    nur <code>COPY</code>
                  </td>
                  <td>0,2 s</td>
                </tr>
                <tr>
                  <td>erst Skript, dann Pakete</td>
                  <td>
                    <code>COPY</code> und das ganze <code>apt-get</code>
                  </td>
                  <td>7,8 s</td>
                </tr>
              </tbody>
            </table>
            <ul className="points">
              <li>
                Die Zeit steckt im <code>RUN apt-get …</code>: Paketlisten laden, 20
                Pakete herunterladen und installieren - bei jeder Änderung am Skript.
              </li>
              <li>
                In <code>docker history</code> sieht man es an <code>CREATED</code>: Nur
                die Schichten ab der Änderung sind neu.
              </li>
            </ul>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
