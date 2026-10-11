import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { registrarUsuario } from '../services/auth'
import styles from './AuthPage.module.css'

export function RegisterPage() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarRegistro = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')

    if (contraseña !== confirmacion) {
      setError('Las contraseñas no coinciden')
      return
    }

    setEnviando(true)

    try {
      await registrarUsuario({
        nombre,
        correo,
        contraseña,
        rol: 'visualizador',
      })
      window.location.assign('/login?registro=exitoso')
    } catch (errorRegistro) {
      setError(errorRegistro instanceof Error ? errorRegistro.message : String(errorRegistro))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLayout}>
          <div className={styles.loginFormPanel}>
            <div className={styles.loginContent}>
              <div className={`${styles.loginBrand} ${styles.registroBrand}`}>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                  alt="Logo"
                  className={styles.loginLogo}
                />
                <h1 className={styles.loginTitle}>SISTEMA DE AGRICULTURA</h1>
              </div>

              <form onSubmit={manejarRegistro}>
                <p className={styles.loginPrompt}>Crea tu cuenta</p>

                <div className={styles.loginField}>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    autoComplete="name"
                    required
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    placeholder="Nombre completo"
                    className={styles.loginInput}
                  />
                </div>

                <div className={styles.loginField}>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    autoComplete="email"
                    required
                    value={correo}
                    onChange={(evento) => setCorreo(evento.target.value)}
                    placeholder="Correo electrónico"
                    className={styles.loginInput}
                  />
                </div>

                <div className={styles.loginField}>
                  <input
                    type="password"
                    id="contraseña"
                    name="contraseña"
                    autoComplete="new-password"
                    required
                    value={contraseña}
                    onChange={(evento) => setContraseña(evento.target.value)}
                    placeholder="Contraseña"
                    className={styles.loginInput}
                  />
                </div>

                <div className={`${styles.loginField} ${styles.loginFieldPassword}`}>
                  <input
                    type="password"
                    id="confirmacion"
                    name="confirmacion"
                    autoComplete="new-password"
                    required
                    value={confirmacion}
                    onChange={(evento) => setConfirmacion(evento.target.value)}
                    placeholder="Confirma tu contraseña"
                    className={styles.loginInput}
                  />
                </div>

                {error && (
                  <p className={`${styles.authMessage} ${styles.authMessageError}`} role="alert">
                    {error}
                  </p>
                )}

                <div className={styles.loginSubmitWrapper}>
                  <button
                    type="submit"
                    className={styles.loginSubmit}
                    disabled={enviando}
                  >
                    {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                  </button>
                </div>

                <p className={styles.registroLoginLink}>
                  ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
              </form>
            </div>
          </div>

          <div className={styles.loginImagePanel}>
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
              alt="Paisaje de agricultura con campos de cultivo"
              className={styles.loginImage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
