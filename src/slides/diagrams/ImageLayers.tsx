import { Fragment } from '@revealjs/react'
import './diagrams.css'

interface Layer {
  id: string
  content: string
  size: string
}

/**
 * Die Schichten von python:3.12 (linux/amd64), neueste oben. IDs und
 * komprimierte Größen stammen aus dem Manifest auf Docker Hub (2026-11-09).
 */
const OWN: Layer[] = [
  {
    id: '685e2037ccfc',
    content: 'Kurznamen: python → python3, pip → pip3',
    size: '249 B',
  },
  {
    id: '4ed680595f4b',
    content: 'Python 3.12 selbst, kompiliert nach /usr/local',
    size: '25,7 MB',
  },
  {
    id: '5ac0faf5954b',
    content: 'Zusatzpakete für Python: tk-dev, uuid-dev …',
    size: '6,1 MB',
  },
]

/** Diese vier Schichten hat python:3.13 genauso. */
const SHARED: Layer[] = [
  {
    id: '696c1fe91c64',
    content: 'Compiler und Entwicklerpakete: gcc, make …',
    size: '237,2 MB',
  },
  { id: '411d2dc8717d', content: 'Versionsverwaltung: git, ssh …', size: '67,8 MB' },
  { id: 'e8a88afca2bd', content: 'curl, wget und Zertifikate', size: '25,6 MB' },
  { id: 'a6dd1c05fbba', content: 'Debian 13: /bin, /etc, /usr …', size: '49,4 MB' },
]

function LayerRow({ layer }: { layer: Layer }) {
  return (
    <li className="image-layers__layer">
      <code>{layer.id}</code>
      <span>{layer.content}</span>
      <span className="image-layers__size">{layer.size}</span>
    </li>
  )
}

/**
 * Ein Image als Stapel von Schichten. Mit `sharedIndex` erscheint neben den
 * unteren vier eine Klammer: Diese Schichten teilt sich python:3.12 mit python:3.13.
 */
export function ImageLayers({ sharedIndex }: { sharedIndex: number }) {
  return (
    <figure className="image-layers">
      <figcaption>python:3.12 - neueste Schicht oben, Größe komprimiert</figcaption>
      <div className="image-layers__body">
        <ol className="image-layers__stack">
          {OWN.map((layer) => (
            <LayerRow key={layer.id} layer={layer} />
          ))}
        </ol>
        <div />
        <ol className="image-layers__stack">
          {SHARED.map((layer) => (
            <LayerRow key={layer.id} layer={layer} />
          ))}
        </ol>
        <Fragment as="div" index={sharedIndex} className="image-layers__shared">
          genauso in python:3.13
        </Fragment>
      </div>
    </figure>
  )
}
