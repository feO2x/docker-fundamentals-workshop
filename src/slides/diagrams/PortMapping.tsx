import './diagrams.css'

/** Der Weg einer Anfrage vom Browser über den Host-Port in den Container. */
export function PortMapping() {
  return (
    <div className="port-mapping">
      <div className="box">Browser</div>
      <div className="port-mapping__arrow">localhost:8080</div>
      <div className="port-mapping__host">
        <span className="guest__label">euer Rechner</span>
        <div className="port-mapping__inner">
          <div className="box box--kernel">Port 8080</div>
          <div className="port-mapping__arrow">-p 8080:80</div>
          <div className="port-mapping__container">
            <span className="guest__label">Container web</span>
            <div className="box box--app">nginx auf Port 80</div>
          </div>
        </div>
      </div>
    </div>
  )
}
