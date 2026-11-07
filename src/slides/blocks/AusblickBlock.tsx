import { Fragment, Slide } from '@revealjs/react'
import nanaAvatar from '../assets/techworld-with-nana.jpg'
import { BlockStack } from '../BlockStack'
import { CenteredLayout } from '../CenteredLayout'
import { ContentLayout } from '../ContentLayout'
import { SCHEDULE } from '../schedule'
import { SectionSlide } from '../SectionSlide'
import { StepCode } from '../StepCode'

const BLOCK_ID = 'ausblick'

const end = SCHEDULE[SCHEDULE.length - 1].end

// Zum Weiterlernen nach dem Workshop, ohne die Tracking-Parameter der Teilen-Links.
const NANA_CHANNEL = 'https://www.youtube.com/@TechWorldwithNana'
const nanaVideos = [
  {
    title: 'Docker Crash Course for Absolute Beginners',
    url: 'https://youtu.be/pg19Z8LL06w',
  },
  {
    title: 'Docker Tutorial for Beginners [FULL COURSE in 3 Hours]',
    url: 'https://youtu.be/3c-iBn73dDE',
  },
]

const compose = [
  'services:',
  '  zaehler:',
  '    build: .',
  '    ports:',
  '      - "8080:8080"',
  '    volumes:',
  '      - zaehler-daten:/app/daten',
  '',
  'volumes:',
  '  zaehler-daten:',
]

/** Block „Ausblick & Fragen“: Compose, Netzwerke, Health Checks, Multi-Arch. */
export function AusblickBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <ContentLayout title="Docker Compose: docker run als Datei">
          <div className="columns">
            <StepCode
              language="yaml"
              lines={compose}
              steps={false}
              className="code--small"
            />
            <ul className="points">
              <li>
                Eine <code>compose.yaml</code> beschreibt, was ihr sonst mit{' '}
                <code>docker build</code> und einem langen <code>docker run</code> tippt.
              </li>
              <Fragment as="li">
                <code>docker compose up -d</code> baut und startet alles,{' '}
                <code>docker compose down</code> räumt auf.
              </Fragment>
              <Fragment as="li">
                Ideal für mehrere Container, die zusammengehören: App, Datenbank, Cache.
              </Fragment>
            </ul>
          </div>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Netzwerke: Container sprechen miteinander">
          <StepCode
            language="shell"
            lines={[
              '$ docker network create workshop',
              '$ docker network connect workshop registry',
              '$ docker run --rm --network workshop --entrypoint curl wetter:1.0 \\',
              '    -s http://registry:5000/v2/_catalog',
              '{"repositories":["wetter","zaehler"]}',
            ]}
            steps="1-2|3-5"
            className="code--small"
          />
          <ul className="points">
            <Fragment as="li">
              Im selben Netzwerk erreichen sich Container über ihren Namen:{' '}
              <code>http://registry:5000</code>. Compose legt so ein Netzwerk automatisch
              an.
            </Fragment>
            <Fragment as="li">
              <code>localhost</code> ist im Container immer der Container selbst - das
              kennt ihr jetzt aus der Abschlussübung.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Health Checks: Läuft er nur, oder geht er auch?">
          <StepCode
            language="dockerfile"
            lines={[
              'FROM nginx',
              'HEALTHCHECK --interval=30s --timeout=3s \\',
              '    CMD curl -f http://localhost/ || exit 1',
            ]}
            steps={false}
          />
          <ul className="points">
            <Fragment as="li">
              Docker führt das Kommando regelmäßig im Container aus.{' '}
              <code>docker ps</code> zeigt dann <code>(healthy)</code> oder{' '}
              <code>(unhealthy)</code>.
            </Fragment>
            <Fragment as="li">
              Orchestrierer wie Kubernetes starten kranke Container neu - dort heißen die
              Checks Probes.
            </Fragment>
            <Fragment as="li">
              Das Kommando muss im Image vorhanden sein. In <code>aspnet</code> und
              chiseled-Images gibt es kein <code>curl</code>.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Multi-Arch: ein Tag, mehrere Plattformen">
          <StepCode
            language="shell"
            lines={[
              '$ docker run --rm --platform linux/arm64 ubuntu:24.04 uname -m',
              'aarch64',
              '$ docker buildx build --platform linux/amd64,linux/arm64 \\',
              '    -t localhost:5050/wetter:1.1 --push .',
            ]}
            steps="1-2|3-4"
            className="code--small"
          />
          <ul className="points">
            <Fragment as="li">
              Hinter <code>ubuntu:24.04</code> stecken Images für mehrere Plattformen.{' '}
              <code>docker pull</code> nimmt automatisch die passende, z. B. arm64 auf
              einem Mac mit Apple Silicon.
            </Fragment>
            <Fragment as="li">
              Fremde Plattformen emuliert Docker Desktop mit QEMU - langsam, aber es geht.
              So entstanden die Images des Linux-Workshops.
            </Fragment>
          </ul>
        </ContentLayout>
      </Slide>

      <Slide>
        <CenteredLayout>
          <p className="eyebrow">Ende um {end}</p>
          <h2 className="section-title">Danke fürs Mitmachen!</h2>
          <div className="further">
            <img className="further__avatar" src={nanaAvatar} alt="" />
            <div>
              <p className="further__label">Zum Weiterlernen auf YouTube</p>
              <p className="further__channel">
                <a href={NANA_CHANNEL} target="_blank" rel="noreferrer">
                  TechWorld with Nana
                </a>{' '}
                <span className="further__handle">@TechWorldwithNana</span>
              </p>
              <ul className="further__videos">
                {nanaVideos.map((video) => (
                  <li key={video.url}>
                    <a href={video.url} target="_blank" rel="noreferrer">
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CenteredLayout>
      </Slide>
    </BlockStack>
  )
}
