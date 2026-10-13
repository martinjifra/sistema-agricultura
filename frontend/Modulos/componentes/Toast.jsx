export function Toast({ toasts }) {
  if (!toasts.length) return null

  return (
    <div className="gd-toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`gd-toast ${toast.tipo === 'error' ? 'es-error' : ''}`}
        >
          {toast.texto}
        </div>
      ))}
    </div>
  )
}
