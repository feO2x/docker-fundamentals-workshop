import { Fragment } from '@revealjs/react'
import './diagrams.css'

/** Zustände eines Containers und die Kommandos, die zwischen ihnen wechseln. */
export function Lifecycle() {
  return (
    <div className="lifecycle">
      <div className="lifecycle__state lifecycle__state--start">Image</div>
      <div className="lifecycle__edge">docker run</div>
      <div className="lifecycle__state lifecycle__state--running">läuft</div>
      <Fragment as="div" className="lifecycle__pair">
        <div className="lifecycle__edge">docker stop ⟶</div>
        <div className="lifecycle__edge">⟵ docker start</div>
      </Fragment>
      <Fragment as="div" className="lifecycle__state">
        gestoppt
      </Fragment>
      <Fragment as="div" className="lifecycle__edge">
        docker rm
      </Fragment>
      <Fragment as="div" className="lifecycle__state lifecycle__state--gone">
        weg
      </Fragment>
    </div>
  )
}
