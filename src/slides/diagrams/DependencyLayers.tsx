import { Fragment } from '@revealjs/react'
import './diagrams.css'

interface Layer {
  title: string
  text: string
}

/** Was unter der Anwendung liegt, von oben nach unten. */
const LAYERS: Layer[] = [
  {
    title: 'Laufzeitumgebung',
    text: '.NET, Python, Node.js … in genau der passenden Version',
  },
  {
    title: 'Bibliotheken',
    text: 'NuGet- und pip-Pakete, aber auch libssl, ICU, tzdata',
  },
  {
    title: 'Konfiguration',
    text: 'Umgebungsvariablen, Zertifikate, Zeitzone, Sprache',
  },
  {
    title: 'Betriebssystem',
    text: 'Ubuntu, Debian … mit Shell, Paketmanager und /etc',
  },
]

/**
 * Die Anwendung oben, darunter erscheinen nacheinander ihre Abhängigkeiten.
 * Ganz unten der Kernel, abgesetzt: Er gehört nicht zur Anwendung.
 */
export function DependencyLayers() {
  return (
    <ol className="dependencies">
      <li className="dependency dependency--app">
        <strong>Eure Anwendung</strong>
        <span>der Code, den ihr geschrieben habt</span>
      </li>
      {LAYERS.map((layer) => (
        <Fragment key={layer.title} as="li" className="dependency">
          <strong>{layer.title}</strong>
          <span>{layer.text}</span>
        </Fragment>
      ))}
      <Fragment as="li" className="dependency dependency--kernel">
        <strong>Kernel</strong>
        <span>gehört dem Rechner, nicht der Anwendung</span>
      </Fragment>
    </ol>
  )
}
