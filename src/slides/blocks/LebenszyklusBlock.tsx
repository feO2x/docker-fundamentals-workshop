import { Fragment, Slide } from '@revealjs/react'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { Lifecycle } from '../diagrams/Lifecycle'
import { PortMapping } from '../diagrams/PortMapping'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'lebenszyklus'

// Ausgaben aus dem Workflow exercises.yml (nginx:latest, Docker 29).
const runWeb = 'docker run -d --name web -p 8080:80 nginx'

/** Block „Container-Lebenszyklus“: Hintergrund, Ports, Logs, exec, stop/start/rm. */
export function LebenszyklusBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Kennt ihr schon: run und exec">
          <StepCode
            lines={['docker run --rm -it ubuntu:24.04', 'docker exec -it web bash']}
            className="code--small"
          />
          <WhenDeckReady>
            <ul className="points">
              <li>
                <code>docker run</code> startet einen <strong>neuen</strong> Container aus
                einem Image. <code>-it</code> verbindet euer Terminal mit ihm.
              </li>
              {/* Erscheint mit dem zweiten Code-Schritt (Index 0, siehe WhenDeckReady). */}
              <Fragment as="li" index={0}>
                <code>docker exec</code> startet ein weiteres Programm in einem Container,
                der <strong>schon läuft</strong> - hier eine Shell im Container{' '}
                <code>web</code>.
              </Fragment>
            </ul>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ein Webserver im Hintergrund">
          <StepCode lines={[runWeb]} />
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt>-d</dt>
              <dd>im Hintergrund (detached): Das Terminal ist sofort wieder frei</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>--name web</dt>
              <dd>ein Name, mit dem ihr den Container später ansprecht</dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>-p 8080:80</dt>
              <dd>Port 8080 eures Rechners führt zu Port 80 im Container</dd>
            </Fragment>
          </dl>
          <Fragment as="p" className="note">
            Danach zeigt <code>http://localhost:8080</code> im Browser die Startseite von
            nginx.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Ports freigeben">
          <PortMapping />
          <ul className="points">
            <Fragment as="li">
              Ein Container hat sein eigenes Netzwerk. Von außen kommt nur hinein, was ihr
              mit <code>-p Host-Port:Container-Port</code> freigebt.
            </Fragment>
            <Fragment as="li">
              Der Host-Port ist frei wählbar, solange ihn nichts anderes belegt. Ein
              zweiter nginx könnte <code>-p 8081:80</code> nehmen.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Was läuft gerade?">
          <StepCode
            language="shell"
            lines={[
              '$ docker ps',
              'CONTAINER ID   IMAGE   STATUS         PORTS                  NAMES',
              '7c43ebc5dcf8   nginx   Up 2 seconds   0.0.0.0:8080->80/tcp   web',
            ]}
            steps={false}
            className="code--small"
          />
          <ul className="points">
            <Fragment as="li">
              <code>STATUS</code> sagt, ob er läuft, <code>PORTS</code> zeigt die
              Freigaben, <code>NAMES</code> den Namen aus <code>--name</code>.
            </Fragment>
            <Fragment as="li">
              <code>docker ps -a</code> zeigt auch gestoppte Container, z. B.{' '}
              <code>Exited (0)</code>.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Was tut er?">
          <StepCode
            language="shell"
            lines={[
              '$ docker logs -n 2 web',
              '2026/11/07 09:03:12 [notice] 1#1: start worker process 32',
              '172.17.0.1 - - [07/Nov/2026:09:03:14 +0000] "GET / HTTP/1.1" 200 896 …',
              '$ docker exec web ls -l /var/log/nginx',
              'lrwxrwxrwx 1 root root 11 Nov  5 07:17 access.log -> /dev/stdout',
              'lrwxrwxrwx 1 root root 11 Nov  5 07:17 error.log -> /dev/stderr',
            ]}
            steps="1-3|4-6"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                <code>docker logs</code> zeigt alles, was der Container ausgibt.{' '}
                <code>-n 2</code> nur die letzten zwei Zeilen, <code>-f</code> liest live
                mit, bis ihr <code>Strg+C</code> drückt.
              </li>
              <li>
                Kennt ihr aus Linux Fundamentals: nginx schreibt in seine Logdateien, und
                die sind Links auf Ausgabe 1 und 2. So landet alles bei Docker.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Konfiguration über Umgebungsvariablen">
          <StepCode
            language="shell"
            lines={[
              '$ docker run --rm -e GRUSS=Moin ubuntu:24.04 printenv GRUSS',
              'Moin',
            ]}
            steps="1-2"
          />
          <ul className="points">
            <Fragment as="li">
              <code>-e NAME=Wert</code> setzt eine Umgebungsvariable im Container. So
              konfiguriert ihr dasselbe Image für Test und Produktion unterschiedlich.
            </Fragment>
            <Fragment as="li">
              ASP.NET Core liest sie direkt als Konfiguration:{' '}
              <code>-e ConnectionStrings__Db=…</code> überschreibt{' '}
              <code>ConnectionStrings:Db</code> aus der <code>appsettings.json</code>.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Stoppen, starten, löschen">
          <Lifecycle />
          <ul className="points">
            <Fragment as="li">
              Ein gestoppter Container behält seine beschreibbare Schicht.{' '}
              <code>docker start web</code> macht dort weiter, wo er aufgehört hat.
            </Fragment>
            <Fragment as="li">
              Erst <code>docker rm</code> löscht ihn. <code>--rm</code> erledigt das
              automatisch, <code>docker rm -f</code> stoppt und löscht in einem Schritt.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Ein Webserver von Anfang bis Ende"
        tasks={[
          <>
            Startet nginx wie eben im Hintergrund und öffnet{' '}
            <code>http://localhost:8080</code>.
          </>,
          <>
            Lest mit <code>docker logs -f web</code> mit und ladet die Seite ein paar Mal
            neu.
          </>,
          <>
            Öffnet mit <code>docker exec -it web bash</code> eine Shell und ersetzt die
            Startseite:{' '}
            <code className="nowrap">
              echo Hallo &gt; /usr/share/nginx/html/index.html
            </code>
          </>,
          <>
            Stoppt den Container, schaut mit <code>docker ps -a</code> nach, startet ihn
            wieder und löscht ihn am Ende.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Ist eure Startseite nach <code>stop</code> und <code>start</code> noch da? Und
          nach <code>rm</code> und einem neuen <code>run</code>?
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Lösung: Ein Webserver von Anfang bis Ende">
          <Spoiler>
            <StepCode
              lines={[
                runWeb,
                'docker logs -f web',
                'docker exec -it web bash',
                'docker stop web',
                'docker ps -a',
                'docker start web',
                'docker rm -f web',
              ]}
              steps={false}
              className="code--small"
            />
            <ul className="points">
              <li>
                Nach <code>stop</code> und <code>start</code> zeigt die Seite noch
                „Hallo“: Die beschreibbare Schicht gehört zum Container, nicht zum Lauf.
              </li>
              <li>
                Nach <code>rm</code> und einem neuen <code>run</code> ist wieder die
                Startseite von nginx da. Der neue Container beginnt frisch mit dem Image.
              </li>
            </ul>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
