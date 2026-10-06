import styles from './ModulePlaceholder.module.css'

interface ModulePlaceholderProps {
  title: string
  owner: string
  modulePath: string
}

export function ModulePlaceholder({ title, owner, modulePath }: ModulePlaceholderProps) {
  return (
    <section className={styles.panel}>
      <h1>{title}</h1>
      <p>Owned by the {owner} team.</p>
      <p>This module is a placeholder. No backend is connected.</p>
      <code>{modulePath}</code>
    </section>
  )
}
