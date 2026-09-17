import { randomUUID } from 'node:crypto'
import os from 'node:os'
import { headers } from 'next/headers'

export type ServerInfo = {
  /** Уникальный идентификатор рендера — на каждый запрос новый. */
  requestId: string
  /** Момент, когда сервер собрал HTML. */
  renderedAt: string
  request: {
    host: string
    protocol: string
    ip: string
    userAgent: string
    language: string
  }
  runtime: {
    nodeVersion: string
    platform: string
    hostname: string
    uptime: string
    memory: string
  }
}

const UNKNOWN = 'не передан'

/**
 * Собирает данные о текущем запросе и процессе.
 *
 * Вызов `headers()` — это request-time API: Next.js не может отрендерить
 * такую страницу на этапе сборки и рендерит её на сервере на каждый запрос.
 */
export async function getServerInfo(): Promise<ServerInfo> {
  const headerList = await headers()

  return {
    requestId: randomUUID(),
    renderedAt: new Date().toISOString(),
    request: {
      host: headerList.get('host') ?? UNKNOWN,
      protocol: headerList.get('x-forwarded-proto') ?? 'http',
      ip: headerList.get('x-forwarded-for')?.split(',')[0].trim() ?? UNKNOWN,
      userAgent: headerList.get('user-agent') ?? UNKNOWN,
      language: headerList.get('accept-language') ?? UNKNOWN,
    },
    runtime: {
      nodeVersion: process.version,
      platform: `${process.platform} / ${process.arch}`,
      hostname: os.hostname(),
      uptime: formatUptime(process.uptime()),
      memory: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} МБ`,
    },
  }
}

export function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Europe/Moscow',
  })
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  return [hours && `${hours} ч`, minutes && `${minutes} мин`, `${secs} с`].filter(Boolean).join(' ')
}
