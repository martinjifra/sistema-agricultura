import { ROLES } from './constantes.js'

/**
 * Permisos por rol. El equipo de login debe pasar `rolActual`
 * (admin | operador | visualizador) al componente GestionDispositivos.
 *
 * - admin: todo
 * - operador: crear y editar (incluye activar/desactivar)
 * - visualizador: solo ver
 */
export function obtenerPermisos(rolActual) {
  const rol = rolActual || ROLES.VISUALIZADOR

  return {
    rol,
    puedeCrear: rol === ROLES.ADMIN || rol === ROLES.OPERADOR,
    puedeEditar: rol === ROLES.ADMIN || rol === ROLES.OPERADOR,
    puedeEliminar: rol === ROLES.ADMIN,
    puedeCambiarEstado: rol === ROLES.ADMIN || rol === ROLES.OPERADOR,
  }
}
