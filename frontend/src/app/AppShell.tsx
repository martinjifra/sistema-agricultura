import { NavLink, Outlet } from 'react-router-dom'
import { frontendModules } from './modules'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.workspace}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <p className={styles.brand}>Irrigation workspace</p>
        <nav className={styles.navigation} aria-label="Primary">
          {frontendModules.map(({ id, navigation }) => (
            <NavLink key={id} to={navigation.path} className={({ isActive }) => isActive ? styles.active : undefined}>
              {navigation.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content" className={styles.content} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
