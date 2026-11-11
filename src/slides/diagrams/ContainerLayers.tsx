import { Fragment } from '@revealjs/react'
import './diagrams.css'

/**
 * Zwei Container auf demselben Image: Die Schicht des Images lesen beide, ohne
 * sie zu kopieren. Geschrieben wird in die eigene Schicht jedes Containers, und
 * jeder sieht beides zusammen als ein einziges Dateisystem.
 */
export function ContainerLayers() {
  return (
    <figure className="container-layers">
      <div className="container-layers__containers">
        {['eins', 'zwei'].map((name) => (
          <Fragment key={name} as="div" className="container-layers__container">
            <span className="guest__label">Container {name}</span>
            <div className="box box--view">
              sieht ein ganzes <code>/</code>: Image plus eigene Änderungen
            </div>
            <div className="box box--app">eigene Schicht, beschreibbar</div>
          </Fragment>
        ))}
      </div>
      <div className="container-layers__image">
        <span className="guest__label">
          Image ubuntu:24.04 - nur lesbar, von beiden geteilt
        </span>
        <div className="box box--os">eine Schicht: /bin, /etc, /usr …</div>
      </div>
    </figure>
  )
}
