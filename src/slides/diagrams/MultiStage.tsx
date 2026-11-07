import { Fragment } from '@revealjs/react'
import './diagrams.css'

/** Die Build-Stage liefert nur ihre Ausgabe an die letzte Stage, der Rest bleibt zurück. */
export function MultiStage() {
  return (
    <div className="multi-stage">
      <figure className="multi-stage__stage multi-stage__stage--discarded">
        <figcaption>Stage build</figcaption>
        <div className="box">.NET SDK, MSBuild, NuGet</div>
        <div className="box">Quellcode, obj/</div>
        <div className="box box--app">/app: Hallo.dll …</div>
      </figure>
      <Fragment as="div" className="multi-stage__arrow">
        COPY --from=build
      </Fragment>
      <Fragment as="figure" className="multi-stage__stage">
        <figcaption>letzte Stage = euer Image</figcaption>
        <div className="box">.NET Runtime</div>
        <div className="box box--app">/app: Hallo.dll …</div>
      </Fragment>
    </div>
  )
}
