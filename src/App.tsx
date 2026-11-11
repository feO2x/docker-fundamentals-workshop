import { AgendaList } from './components/AgendaList'
import { ThemeToggle } from './components/ThemeToggle'
import { AGENDA, START_TIME } from './data/agenda'
import { buildSchedule, formatDuration } from './lib/time'
import './App.css'

const total = AGENDA.reduce((sum, block) => sum + block.duration, 0)
const praxis = AGENDA.reduce((sum, block) => sum + (block.praxis ?? 0), 0)
const end = buildSchedule(START_TIME, [total])[0].end

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero__top">
          <p className="hero__eyebrow">Workshop</p>
          <ThemeToggle />
        </div>
        <h1 className="hero__title">Docker Fundamentals</h1>
        <p className="hero__lede">
          Vom ersten Container bis zur eigenen Anwendung samt Datenbank in Docker Compose.
          Der Workshop baut auf Linux Fundamentals auf: Dort habt ihr gesehen, dass sich
          Container den Kernel des Hosts teilen. Hier packt ihr den Rest, den kompletten
          User Space, in ein Image.
        </p>

        <a className="cta" href="slides.html">
          Zu den Folien
          <span className="cta__arrow" aria-hidden="true">
            →
          </span>
        </a>

        <dl className="stats">
          <div className="stat">
            <dt>Dauer</dt>
            <dd>{formatDuration(total)}</dd>
          </div>
          <div className="stat">
            <dt>Zeitrahmen</dt>
            <dd>
              {START_TIME}-{end}
            </dd>
          </div>
          <div className="stat stat--accent">
            <dt>Praxisanteil</dt>
            <dd>{formatDuration(praxis)}</dd>
          </div>
          <div className="stat">
            <dt>Vorkenntnisse</dt>
            <dd>Linux Fundamentals</dd>
          </div>
        </dl>
      </header>

      <main>
        <AgendaList blocks={AGENDA} start={START_TIME} />
      </main>

      <footer className="footer">
        <p>
          {formatDuration(praxis)} der {formatDuration(total)} sind praktische Übung. Der
          Block <strong>Fragen</strong> am Ende dient als Zeitpuffer.
        </p>
      </footer>
    </div>
  )
}
