import { Fragment } from '@revealjs/react'
import './diagrams.css'

/**
 * Zwei Container auf demselben Image: Die Schichten des Images teilen sie sich
 * nur lesend, geschrieben wird in die eigene Schicht jedes Containers.
 */
export function ContainerLayers() {
  return (
    <figure className="container-layers">
      <div className="container-layers__containers">
        {['eins', 'zwei'].map((name) => (
          <Fragment key={name} as="div" className="container-layers__container">
            <span className="guest__label">Container {name}</span>
            <div className="box box--app">beschreibbare Schicht</div>
          </Fragment>
        ))}
      </div>
      <div className="container-layers__image">
        <span className="guest__label">Image ubuntu:24.04 - nur lesbar, geteilt</span>
        <div className="box box--os">Dateien des User Space: /bin, /etc, /usr …</div>
      </div>
    </figure>
  )
}
