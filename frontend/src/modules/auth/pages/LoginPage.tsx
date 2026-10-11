import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { iniciarSesion } from '../services/auth'
import styles from './AuthPage.module.css'

export function LoginPage() {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const registroCompletado =
    new URLSearchParams(window.location.search).get('registro') === 'exitoso'

  const manejarInicioSesion = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')
    setMensaje('')
    setEnviando(true)

    try {
      const respuesta = await iniciarSesion({ correo, contraseña })
      sessionStorage.setItem('agricultura_token', respuesta.token)
      sessionStorage.setItem(
        'agricultura_usuario',
        JSON.stringify(respuesta.usuario),
      )
      setMensaje(respuesta.message || 'Inicio de sesión exitoso')
    } catch (errorInicio) {
      setError(errorInicio instanceof Error ? errorInicio.message : String(errorInicio))
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
              <div className={styles.loginBrand}>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                  alt="Logo"
                  className={styles.loginLogo}
                />
                <h1 className={styles.loginTitle}>SISTEMA DE AGRICULTURA</h1>
              </div>

              <form onSubmit={manejarInicioSesion}>
                <p className={styles.loginPrompt}>Inicia sesión en tu cuenta</p>

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

                <div className={`${styles.loginField} ${styles.loginFieldPassword}`}>
                  <input
                    type="password"
                    id="contraseña"
                    name="contraseña"
                    autoComplete="current-password"
                    required
                    value={contraseña}
                    onChange={(evento) => setContraseña(evento.target.value)}
                    placeholder="Contraseña"
                    className={styles.loginInput}
                  />
                </div>

                {registroCompletado && (
                  <p className={`${styles.authMessage} ${styles.authMessageSuccess}`} role="status">
                    Cuenta creada. Ya puedes iniciar sesión.
                  </p>
                )}
                {mensaje && (
                  <p className={`${styles.authMessage} ${styles.authMessageSuccess}`} role="status">
                    {mensaje}
                  </p>
                )}
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
                    {enviando ? 'Iniciando sesión...' : 'iniciar sesión'}
                  </button>
                </div>

                <div className={styles.loginForgotWrapper}>
                  <a href="#!" className={styles.loginForgot}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <div className={styles.loginRegister}>
                  <p className={styles.loginRegisterPrompt}>¿No tienes una cuenta?</p>
                  <Link to="/register" className={styles.loginRegisterButton}>
                    CREAR
                    <br />
                    CUENTA
                  </Link>
                </div>
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
