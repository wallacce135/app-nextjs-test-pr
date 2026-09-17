'use client'

import { useEffect, useState } from 'react'

/**
 * Клиентский компонент: до гидратации сервер отдаёт прочерк,
 * время появляется только после запуска JS в браузере.
 */
export function ClientTime() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('ru-RU'))

    tick()
    const timer = setInterval(tick, 1000)

    return () => clearInterval(timer)
  }, [])

  return <span>{time ?? '— (JS ещё не выполнился)'}</span>
}
