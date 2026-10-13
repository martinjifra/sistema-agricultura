export function SelectorRol({ usuarios, usuarioId, onChange }) {
  return (
    <div className="gd-selector-rol" title="Solo para pruebas. El login lo reemplazará.">
      <label htmlFor="gd-rol">Rol de prueba</label>
      <select
        id="gd-rol"
        value={usuarioId}
        onChange={(evento) => onChange(evento.target.value)}
      >
        {usuarios.map((usuario) => (
          <option key={usuario.id} value={usuario.id}>
            {usuario.nombre} ({usuario.rol})
          </option>
        ))}
      </select>
    </div>
  )
}
