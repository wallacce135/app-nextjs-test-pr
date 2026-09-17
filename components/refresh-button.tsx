'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import styles from './refresh-button.module.css'

/**
 * Клиентский компонент: `router.refresh()` заставляет сервер
 * отрендерить страницу заново и подменяет разметку без перезагрузки.
 */
export function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      className={styles.button}
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {isPending ? 'Рендерим…' : 'Отрендерить заново'}
    </button>
  )
}
