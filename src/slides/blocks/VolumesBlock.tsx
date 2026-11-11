import { Fragment, Slide } from '@revealjs/react'
import { BlockStack } from '../BlockStack'
import { ContentLayout } from '../ContentLayout'
import { ExerciseSlide } from '../ExerciseSlide'
import { SectionSlide } from '../SectionSlide'
import { Spoiler } from '../Spoiler'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const BLOCK_ID = 'volumes'

// ${PWD} funktioniert in Bash und PowerShell gleichermaßen.
const bindMountRun =
  'docker run -d --name web -p 8080:80 -v "${PWD}/website:/usr/share/nginx/html" nginx'

const noteWrite = (text: string) =>
  `docker run --rm -v notizen:/daten ubuntu:24.04 sh -c "echo ${text} >> /daten/notiz.txt"`
const noteRead = 'docker run --rm -v notizen:/daten ubuntu:24.04 cat /daten/notiz.txt'

/** Block „Volumes & Bind Mounts“: Daten außerhalb des Containers. */
export function VolumesBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Container sind Wegwerfware">
          <ul className="points">
            <li>
              Alles, was ein Container schreibt, landet in seiner beschreibbaren Schicht.{' '}
              <code>docker rm</code> löscht sie mit ihm.
            </li>
            <Fragment as="li">
              Das ist gewollt: Eine neue Version eurer Anwendung heißt neues Image, neuer
              Container. Den alten werft ihr weg.
            </Fragment>
            <Fragment as="li">
              Datenbanken, Uploads, Zählerstände dürfen das nicht mitmachen. Sie gehören
              an einen Ort außerhalb des Containers.
            </Fragment>
          </ul>
          <Fragment as="p" className="takeaway">
            Mit <code>-v Quelle:Ziel</code> hängt ihr einen solchen Ort in den Container
            ein.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Zwei Arten, Daten einzuhängen">
          <table className="compare">
            <thead>
              <tr>
                <th></th>
                <th>Named Volume</th>
                <th>Bind Mount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Beispiel</td>
                <td>
                  <code>-v notizen:/daten</code>
                </td>
                <td>
                  <code>-v "$&#123;PWD&#125;/website:/usr/…"</code>
                </td>
              </tr>
              <tr>
                <td>Quelle</td>
                <td>ein Name: Docker legt das Volume an und verwaltet es</td>
                <td>ein Pfad: ein Ordner auf eurem Rechner</td>
              </tr>
              <tr>
                <td>Wofür</td>
                <td>Daten der Anwendung, z. B. eine Datenbank</td>
                <td>Dateien, die ihr selbst bearbeitet, z. B. Config oder Quellcode</td>
              </tr>
              <tr>
                <td>Weg nach</td>
                <td>
                  <code>docker volume rm notizen</code>
                </td>
                <td>Löschen des Ordners</td>
              </tr>
            </tbody>
          </table>
          <Fragment as="p" className="note">
            Docker erkennt den Unterschied an der Quelle: Ein Pfad mit <code>/</code> oder
            Laufwerksbuchstaben ist ein Bind Mount, ein bloßer Name ein Volume.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Bind Mount: ein Ordner von eurem Rechner">
          <StepCode lines={[bindMountRun]} className="code--small" />
          <dl className="legend legend--auto">
            <Fragment as="div" className="legend__row">
              <dt>{'${PWD}/website'}</dt>
              <dd>
                der Ordner <code>website</code> im aktuellen Verzeichnis. Docker braucht
                einen absoluten Pfad, <code>{'${PWD}'}</code> liefert ihn in Bash und
                PowerShell.
              </dd>
            </Fragment>
            <Fragment as="div" className="legend__row">
              <dt>/usr/share/nginx/html</dt>
              <dd>wo nginx seine Seiten sucht. Was das Image dort hat, wird verdeckt.</dd>
            </Fragment>
          </dl>
          <Fragment as="p" className="takeaway">
            Ändert ihr die Datei auf eurem Rechner, liefert nginx sofort die neue Fassung
            aus.
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Named Volume: Docker verwaltet die Daten">
          <StepCode
            language="shell"
            lines={[
              `$ ${noteWrite('Hallo')}`,
              `$ ${noteWrite('Welt')}`,
              `$ ${noteRead}`,
              'Hallo',
              'Welt',
            ]}
            steps="1|2|3-5"
            className="code--dense"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Drei Container nacheinander, alle mit <code>--rm</code> - und trotzdem
                bleibt die Datei. Sie liegt im Volume, nicht im Container.
              </li>
              <li>
                Gibt es <code>notizen</code> noch nicht, legt Docker es beim ersten{' '}
                <code>-v</code> an. <code>docker volume ls</code> zeigt alle Volumes.
              </li>
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>

      <ExerciseSlide
        blockId={BLOCK_ID}
        title="Übung: Daten, die bleiben"
        tasks={[
          <>
            Wechselt in den Ordner <code>exercises</code> der Übungsdateien und startet
            nginx mit dem Bind Mount von eben. Öffnet <code>http://localhost:8080</code>.
          </>,
          <>
            Ändert den Text in <code>website/index.html</code> im Editor und ladet die
            Seite neu.
          </>,
          <>
            Schreibt mit zwei Containern zwei Zeilen ins Volume <code>notizen</code> und
            lest sie mit einem dritten. Die Kommandos stehen auf der Folie vorher.
          </>,
          <>
            Räumt auf: <code>docker rm -f web</code> und{' '}
            <code>docker volume rm notizen</code>.
          </>,
        ]}
      >
        <p className="question">
          <span className="question__label">Findet heraus</span>
          Wo liegen die Daten von <code>notizen</code> eigentlich? Fragt{' '}
          <code>docker volume inspect notizen</code>.
        </p>
      </ExerciseSlide>

      <Slide>
        <ContentLayout title="Lösung: Daten, die bleiben">
          <Spoiler>
            <StepCode
              language="shell"
              lines={[
                '$ docker volume inspect notizen',
                '[ { "Driver": "local",',
                '    "Mountpoint": "/var/lib/docker/volumes/notizen/_data",',
                '    "Name": "notizen", … } ]',
              ]}
              steps={false}
              className="code--small"
            />
            <ul className="points">
              <li>
                Volumes liegen unter <code>/var/lib/docker/volumes</code> - auf dem Host,
                den Docker benutzt. Unter Windows und macOS ist das die Linux-VM von
                Docker Desktop, also nicht direkt in eurem Explorer oder Finder.
              </li>
              <li>
                Der Bind Mount dagegen zeigt auf euren eigenen Ordner. Deshalb wirkt eure
                Änderung im Editor sofort.
              </li>
            </ul>
          </Spoiler>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
