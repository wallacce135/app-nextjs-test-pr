import type { Metadata } from 'next'
import Link from 'next/link'

import './globals.css'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'Next.js SSR — пример для Timeweb Cloud Apps',
  description:
    'Простое приложение Next.js на App Router: страницы рендерятся на сервере на каждый запрос.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru">
      <body>
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span aria-hidden="true">▲</span> Next.js SSR
          </Link>
          <nav className={styles.nav}>
            <Link href="/">Главная</Link>
            <Link href="/posts">Данные из API</Link>
            <a href="/api/server-info">JSON</a>
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          Развёрнуто в{' '}
          <a href="https://timeweb.cloud/services/apps" target="_blank" rel="noreferrer">
            Timeweb Cloud Apps
          </a>
        </footer>
      </body>
    </html>
  )
}
