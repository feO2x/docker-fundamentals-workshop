import { Fragment, Slide } from '@revealjs/react'
import { AGENDA } from '../../data/agenda'
import { BlockStack } from '../BlockStack'
import { CenteredLayout } from '../CenteredLayout'
import { ContentLayout } from '../ContentLayout'
import { DOTNET_SDK, PYTHON_312, PYTHON_313 } from '../images'
import { Principle } from '../Principle'
import { SCHEDULE, slotOf } from '../schedule'
import { StepCode } from '../StepCode'
import { WhenDeckReady } from '../WhenDeckReady'

const end = SCHEDULE[SCHEDULE.length - 1].end
const finalExercise = slotOf('abschlussuebung')

// Die Übungsdateien liegen in exercises/ dieses Repos.
const EXERCISES_REPO = 'https://github.com/feO2x/docker-fundamentals-workshop.git'

/** Titelfolie, Ziel des Workshops, Agenda-Übersicht und Vorbereitung. */
export function Opening() {
  return (
    <BlockStack>
      <Slide>
        <CenteredLayout>
          <p className="eyebrow">Workshop</p>
          <h1>Docker Fundamentals</h1>
        </CenteredLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Euer Ziel für heute">
          <p className="lede lede--strong">
            Um {finalExercise.start} bringt ihr eine kleine Anwendung in ein eigenes
            Image, startet sie als Container und schiebt das Image in eine Registry.
          </p>
          <Fragment as="p" className="note">
            Dafür baut ihr auf einem Gedanken auf, den ihr aus Linux Fundamentals schon
            kennt:
          </Fragment>
          <Fragment as="div">
            <Principle />
          </Fragment>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Agenda">
          {/* Spaltenweise füllen: erste Hälfte links, zweite rechts. */}
          <ol
            className="agenda-overview"
            style={{ gridTemplateRows: `repeat(${Math.ceil(AGENDA.length / 2)}, auto)` }}
          >
            {AGENDA.map((block, index) => (
              <li key={block.id} data-kind={block.kind}>
                <time dateTime={SCHEDULE[index].start}>{SCHEDULE[index].start}</time>
                <span className="agenda-overview__title">{block.title}</span>
                <span className="agenda-overview__duration">{block.duration} min</span>
              </li>
            ))}
          </ol>
          <p className="agenda-overview__end">Ende um {end}</p>
        </ContentLayout>
      </Slide>

      <Slide>
        <ContentLayout title="Bevor es losgeht">
          <StepCode
            lines={[
              '# Läuft Docker? Client und Server müssen antworten',
              'docker version',
              '# Images für die erste Übung schon mal herunterladen',
              `docker pull ${PYTHON_312}`,
              `docker pull ${PYTHON_313}`,
              `docker pull ${DOTNET_SDK}`,
              '# Übungsdateien holen',
              `git clone ${EXERCISES_REPO}`,
            ]}
            steps="1-2|3-6|7-8"
            className="code--small"
          />
          <WhenDeckReady>
            <Fragment as="ul" className="points">
              <li>
                Das .NET SDK ist gut 350 MB groß. Startet den Download jetzt, dann ist er
                bis zur ersten Übung durch.
              </li>
              <li>
                Was <code>docker pull</code> genau macht, erklären wir später genau.
              </li>
            </Fragment>
            <Fragment as="p" className="note">
              <strong>Windows:</strong> Nehmt PowerShell oder Windows Terminal. In Git
              Bash scheitert <code>docker run -it</code> mit „the input device is not a
              TTY“.
            </Fragment>
          </WhenDeckReady>
        </ContentLayout>
      </Slide>
    </BlockStack>
  )
}
