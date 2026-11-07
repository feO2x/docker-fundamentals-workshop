import { Fragment } from '@revealjs/react'
import { PYTHON_312, PYTHON_313 } from '../images'
import './diagrams.css'

interface Container {
  image: string
  runtime: string
  os: string
}

/**
 * Die Images der ersten Übung, das Linux wie in deren /etc/os-release. Das
 * SDK-Image ohne `mcr.microsoft.com/`, damit die Spalten gleich breit bleiben.
 */
const CONTAINERS: Container[] = [
  { image: PYTHON_312, runtime: 'Python 3.12', os: 'Debian 13' },
  { image: PYTHON_313, runtime: 'Python 3.13', os: 'Debian 13' },
  { image: 'dotnet/sdk:10.0', runtime: '.NET SDK 10', os: 'Ubuntu 24.04' },
]

/**
 * Drei Container auf einem Host: Jeder bringt Laufzeitumgebung und Linux
 * selbst mit, den Kernel teilen sie sich. Die Container erscheinen nacheinander.
 */
export function ImageStacks() {
  return (
    <figure className="image-stacks">
      <div className="image-stacks__containers">
        {CONTAINERS.map((container) => (
          <Fragment key={container.image} as="div" className="guest">
            <span className="guest__label">{container.image}</span>
            <div className="box box--app">{container.runtime}</div>
            <div className="box box--os">{container.os}</div>
          </Fragment>
        ))}
      </div>
      <div className="box box--kernel">Kernel des Hosts - geteilt</div>
      <div className="box box--hardware">Hardware</div>
    </figure>
  )
}
