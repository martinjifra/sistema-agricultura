interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: 'administrador' | 'visualizador'
}

interface RespuestaApi {
  message?: string
}

interface RespuestaLogin extends RespuestaApi {
  token: string
  usuario: Usuario
}

interface Credenciales {
  correo: string
  contraseña: string
}

interface DatosRegistro extends Credenciales {
  nombre: string
  rol: 'visualizador'
}

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const enviarSolicitud = async <T extends RespuestaApi>(
  ruta: string,
  datos: Credenciales | DatosRegistro,
): Promise<T> => {
  const respuesta = await fetch(`${API_URL}/api/auth/${ruta}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  })
  const resultado: T = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.message || 'No se pudo completar la solicitud')
  }

  return resultado
}

export const iniciarSesion = (credenciales: Credenciales) =>
  enviarSolicitud<RespuestaLogin>('login', credenciales)

export const registrarUsuario = (datosUsuario: DatosRegistro) =>
  enviarSolicitud<RespuestaApi>('registro', datosUsuario)
