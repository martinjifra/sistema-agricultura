export function ModalConfirmacion({
  titulo,
  mensaje,
  confirmarTexto = 'Confirmar',
  peligro = false,
  onCancelar,
  onConfirmar,
  ocupado = false,
}) {
  return (
    <div className="gd-overlay" role="presentation" onClick={onCancelar}>
      <div
        className="gd-panel gd-confirmacion"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gd-confirm-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="gd-confirm-titulo">{titulo}</h2>
        <p>{mensaje}</p>
        <div className="gd-acciones-final">
          <button type="button" className="gd-btn gd-btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            type="button"
            className={`gd-btn ${peligro ? 'gd-btn-peligro' : ''}`}
            onClick={onConfirmar}
            disabled={ocupado}
          >
            {ocupado ? 'Procesando…' : confirmarTexto}
          </button>
        </div>
      </div>
    </div>
  )
}
