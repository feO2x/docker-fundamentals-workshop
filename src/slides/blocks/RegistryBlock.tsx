import { Fragment, Slide } from '@revealjs/react'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { Flow } from '../diagrams/Flow'
import { ExerciseSlide } from '../ExerciseSlide'
import { REGISTRY_RUN } from '../images'
import { RefAnatomy } from '../RefAnatomy'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'registry'

/** Block „Taggen & Pushen“: Image-Namen, Push/Pull, Login und die Falle mit latest. */
export function RegistryBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Der Name ist die Adresse">
          <RefAnatomy
            parts={[
              { text: 'localhost:5050', role: 'registry' },
              { text: '/', role: 'separator' },
              { text: 'wetter', role: 'name' },
              { text: ':', role: 'separator' },
              { text: '1.0', role: 'tag' },
            ]}
          />
          <StepCode
            language="shell"
            lines={[
              '$ docker tag wetter:1.0 localhost:5050/wetter:1.0',
              '$ docker image ls',
              'IMAGE                       ID             DISK USAGE   CONTENT SIZE',
              'localhost:5050/wetter:1.0   f8ee723c4232        132MB         33.6MB',
              'wetter:1.0                  f8ee723c4232        132MB         33.6MB',
            ]}
            steps="1|2-5"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="p" className="note">
              <code>docker tag</code> kopiert nichts. Dieselbe ID bekommt einen zweiten
              Namen - und der Name verrät, wohin ein Push geht.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Push und Pull">
          <Flow
            animate
            steps={[
              { title: 'Euer Rechner', text: 'baut und taggt das Image' },
              { title: 'Registry', text: 'lagert es unter seinem Namen' },
              { title: 'Server', text: 'holt es und startet es', accent: true },
            ]}
            arrows={['docker push', 'docker pull']}
          />
          <StepCode
            lines={[
              'docker push localhost:5050/wetter:1.0',
              'docker pull localhost:5050/wetter:1.0',
            ]}
            steps={false}
            className="code--small"
          />
          <Fragment as="p" className="note">
            Geschoben werden nur Schichten, die die Registry noch nicht hat. Beim nächsten
            Push nach einer Skriptänderung ist das nur noch eine kleine.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Anmelden">
          <StepCode
            lines={[
              '# Unsere Registry (Harbor)',
              'docker login hub.gwvs.de',
              '# Docker Hub',
              'docker login',
            ]}
            steps={false}
          />
          <ul className="points">
            <Fragment as="li">
              Pullen von öffentlichen Images geht ohne Login, Pushen und private Images
              nicht.
            </Fragment>
            <Fragment as="li">
              Docker merkt sich die Anmeldung pro Registry. <code>docker logout</code>{' '}
              vergisst sie wieder.
            </Fragment>
            <Fragment as="li">
              Unsere Übungs-Registry läuft lokal und braucht keinen Login.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Die Falle mit latest">
          <ul className="points">
            <li>
              <code>latest</code> ist kein „neuestes“, sondern nur der Tag, den Docker
              einsetzt, wenn ihr keinen angebt: <code>docker run wetter</code> heißt{' '}
              <code>wetter:latest</code>.
            </li>
            <Fragment as="li">
              Er zeigt auf das, was zuletzt jemand als <code>latest</code> gepusht hat.
              Das kann sich jederzeit ändern - oder seit Monaten nicht.
            </Fragment>
            <Fragment as="li">
              Zwei Server, die <code>app:latest</code> an verschiedenen Tagen ziehen,
              laufen womöglich mit verschiedenen Versionen.
            </Fragment>
          </ul>
          <Fragment as="p" className="takeaway">
            Auf Servern immer eine feste Version angeben: <code>app:1.4.2</code>, nie{' '}
            <code>app:latest</code>.
          </Fragment>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Eure eigene Registry"
        tasks={[
          <>
            Startet eine Registry als Container:
            <StepCode lines={[REGISTRY_RUN]} className="code--small" />
          </>,
          <>
            Taggt <code>wetter:1.0</code> als <code>localhost:5050/wetter:1.0</code> und
            pusht es.
          </>,
          <>
            Öffnet <code>http://localhost:5050/v2/_catalog</code> im Browser.
          </>,
          <>
            Löscht das Image lokal mit <code>docker image rm</code>, holt es mit{' '}
            <code>docker pull</code> zurück und startet es.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Welche Schichten lädt der Pull wirklich herunter, und warum nicht alle?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Lösung: Eure eigene Registry">
          <Spoiler>
            <StepCode
              language="shell"
              lines={[
                '$ docker tag wetter:1.0 localhost:5050/wetter:1.0',
                '$ docker push localhost:5050/wetter:1.0',
                '$ docker image rm localhost:5050/wetter:1.0',
                'Untagged: localhost:5050/wetter:1.0',
                '$ docker pull localhost:5050/wetter:1.0',
                '$ docker run --rm localhost:5050/wetter:1.0 Berlin',
                'Berlin: 1.9 °C, Wind 9.0 km/h',
              ]}
              steps={false}
              className="code--small"
            />
            <ul className="points">
              <li>
                Der Katalog zeigt <code>{'{"repositories":["wetter"]}'}</code>.
              </li>
              <li>
                Löscht ihr nur <code>localhost:5050/wetter:1.0</code>, lädt der Pull gar
                nichts: <code>wetter:1.0</code> hat dieselben Schichten noch.
              </li>
              <li>
                Löscht ihr beide Namen, kommt nur die Schicht mit dem Skript. Alle anderen
                meldet Docker als <code>Already exists</code>, weil andere Images sie
                schon mitbringen.
              </li>
            </ul>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
