import { Fragment, Slide } from '@revealjs/react'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { ContainerLayers } from '../diagrams/ContainerLayers'
import { Flow } from '../diagrams/Flow'
import { ImageLayers } from '../diagrams/ImageLayers'
import { ExerciseSlide } from '../ExerciseSlide'
import { PYTHON_312 } from '../images'
import { RefAnatomy } from '../RefAnatomy'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'konzepte'

/** Block „Image, Container, Registry“: die drei Begriffe und die Image-Referenz. */
export function KonzepteBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Drei Begriffe">
          <Flow
            animate
            steps={[
              {
                title: 'Registry',
                text: 'das Lager: unser Harbor hub.gwvs.de, Docker Hub, mcr.microsoft.com, GitHub Registry...',
              },
              {
                title: 'Image',
                text: 'der unveränderliche Bauplan: alle Dateien plus Startbefehl',
              },
              {
                title: 'Container',
                text: 'die laufende Instanz eines Images',
                accent: true,
              },
            ]}
            arrows={['docker pull', 'docker run']}
          />
          <Fragment as="p" className="takeaway">
            Aus einem Image startet ihr beliebig viele Container - wie Objekte aus einer
            Klasse.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Was docker run eigentlich tut">
          <StepCode
            language="shell"
            lines={[
              `$ docker run --rm ${PYTHON_312} python --version`,
              "Unable to find image 'python:3.12' locally",
              '3.12: Pulling from library/python',
              '685e2037ccfc: Pull complete',
              '…',
              'Status: Downloaded newer image for python:3.12',
              'Python 3.12.16',
            ]}
            steps="1|2-6|7"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Fehlt das Image, holt <code>docker run</code> es zuerst aus der Registry.
                Jede Zeile mit <code>Pull complete</code> ist eine Schicht des Images.
              </li>
              <li>
                <code>docker pull</code> erledigt nur diesen ersten Teil. Beim zweiten
                Start ist das Image schon da.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Image besteht aus Schichten">
          <ImageLayers sharedIndex={1} />
          <ul className="points">
            <Fragment as="li" index={0}>
              Jede Schicht enthält nur, was ein Bauschritt hinzugefügt oder geändert hat.
              Übereinandergelegt ergeben sie ein Dateisystem - wie Folien auf dem
              Overheadprojektor.
            </Fragment>
            <Fragment as="li" index={1}>
              Schichten ändern sich nie. Haben zwei Images dieselbe Schicht, lädt und
              speichert Docker sie nur einmal: Beim Pull steht dann{' '}
              <code>Already exists</code>.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Eine Image-Referenz lesen">
          <RefAnatomy
            parts={[
              { text: 'mcr.microsoft.com', role: 'registry' },
              { text: '/', role: 'separator' },
              { text: 'dotnet/sdk', role: 'name' },
              { text: ':', role: 'separator' },
              { text: '10.0', role: 'tag' },
            ]}
          />
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt className="ref-anatomy__registry">mcr.microsoft.com</dt>
              <dd>die Registry, bei der das Image liegt</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>dotnet/sdk</dt>
              <dd>der Name des Images in dieser Registry</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt className="ref-anatomy__tag">10.0</dt>
              <dd>der Tag, meist eine Version. Fehlt er, gilt latest.</dd>
            </Fragment>
          </dl>
          <Fragment as="p" className="note">
            Ohne Registry gilt Docker Hub: <code>python:3.12</code> heißt eigentlich{' '}
            <code>docker.io/library/python:3.12</code>.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Was liegt auf eurem Rechner?">
          <StepCode
            language="shell"
            lines={[
              '$ docker image ls',
              'IMAGE                              ID             DISK USAGE   CONTENT SIZE',
              'mcr.microsoft.com/dotnet/sdk:10.0  212fe4cb7462      1.29GB          353MB',
              'python:3.12                        cad37dd20c7c      1.62GB          430MB',
              'python:3.13                        ecbe213fb818      1.63GB          432MB',
            ]}
            steps="1-5|3-5"
            className="code--small code--command"
          />
          <WhenDeckReady>
            <Fragment as="dl" className="legend legend--auto">
              <dt>CONTENT SIZE</dt>
              <dd>so viel lädt ein Pull herunter, komprimiert</dd>
              <dt>DISK USAGE</dt>
              <dd>so viel Platz belegt das entpackte Image</dd>
            </Fragment>
            <Fragment as="p" className="note">
              <code>docker image inspect python:3.12</code> zeigt alle Details:
              Startbefehl, Umgebungsvariablen, Schichten.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Image, viele Container">
          <ContainerLayers />
          <Fragment as="p" className="takeaway">
            Das Image ändert sich nie. Jeder Container schreibt in seine eigene Schicht,
            und die verschwindet mit ihm.
          </Fragment>
          <Fragment as="p" className="note">
            Ändert ein Container eine Datei aus dem Image, kopiert Docker sie erst dann in
            seine Schicht. Beim Start wird nichts kopiert, deshalb ist ein Container
            sofort da.
          </Fragment>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Zwei Container, ein Image"
        tasks={[
          <>
            Startet in zwei Terminals je einen Container aus demselben Image:
            <StepCode
              lines={[
                'docker run --rm -it --hostname eins ubuntu:24.04',
                'docker run --rm -it --hostname zwei ubuntu:24.04',
              ]}
              steps={false}
              className="code--small"
            />
          </>,
          <>
            Legt in <code>eins</code> eine Datei an:{' '}
            <code>echo hallo &gt; /tmp/datei</code>
          </>,
          <>
            Sucht sie in <code>zwei</code> mit <code>cat /tmp/datei</code>.
          </>,
          <>
            Schaut in einem dritten Terminal mit <code>docker ps -s</code>, wie groß die
            beiden Container sind.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Warum sieht <code>zwei</code> die Datei nicht? Und was passiert mit ihr bei{' '}
          <code>exit</code>?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Lösung: Zwei Container, ein Image">
          <Spoiler>
            <StepCode
              language="shell"
              lines={[
                'root@zwei:/# cat /tmp/datei',
                'cat: /tmp/datei: No such file or directory',
                '',
                '$ docker ps -s',
                'CONTAINER ID   IMAGE          …   NAMES   SIZE',
                '8bfd87711de2   ubuntu:24.04   …   zwei    4.1kB (virtual 87.7MB)',
                '015837648f58   ubuntu:24.04   …   eins    12.3kB (virtual 87.7MB)',
              ]}
              steps={false}
              className="code--dense"
            />
            <ul className="points">
              <li>
                Beide Container lesen die Schicht von <code>ubuntu:24.04</code>.{' '}
                <code>/tmp/datei</code> liegt in der beschreibbaren Schicht von{' '}
                <code>eins</code>.
              </li>
              <li>
                <code>SIZE</code> ist nur die eigene Schicht, ein paar Kilobyte.{' '}
                <code>virtual</code> zählt das Image mit, das nur einmal auf der Platte
                liegt.
              </li>
              <li>
                Mit <code>exit</code> endet <code>eins</code>, und <code>--rm</code>{' '}
                löscht ihn samt seiner Schicht. Die Datei ist weg.
              </li>
              <li>
                Wie Daten einen Container überleben, zeigt der Block{' '}
                <strong>Volumes &amp; Bind Mounts</strong>.
              </li>
            </ul>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
