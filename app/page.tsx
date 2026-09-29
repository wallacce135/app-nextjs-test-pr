import Link from 'next/link'
import type { ReactNode } from 'react'

import { ClientTime } from '@/components/client-time'
import { RefreshButton } from '@/components/refresh-button'
import { formatTime, getServerInfo } from '@/lib/server-info'

import styles from './page.module.css'

export default async function HomePage() {
  // Данные собираются на сервере при каждом запросе — ничего из этого
  // не зафиксировано на этапе сборки.
  const { requestId, renderedAt, request, runtime } = await getServerInfo()
  console.log('11');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.badge}>Server-Side Rendering</p>
        <h1 className={styles.title}>Тестирование новой ветки на стенде</h1>
        <h1 className={styles.title}>Эту страницу собрал сервер</h1>
        <p className={styles.lead}>
          Браузер получил готовый HTML со значениями ниже: они вычисляются в Node.js на каждый
          запрос. Нажмите кнопку или обновите страницу — сервер отрендерит её заново, и{' '}
          <code>requestId</code> со временем рендера изменятся.
        </p>
        <div className={styles.actions}>
          <RefreshButton />
          <span className={styles.hint}>без перезагрузки страницы</span>
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.card} data-request-id={requestId}>
          <h2 className={styles.cardTitle}>Этот запрос</h2>
          <dl className={styles.list}>
            <Row label="requestId" value={requestId} mono />
            <Row label="Время рендера" value={formatTime(renderedAt)} />
            <Row label="Host" value={request.host} mono />
            <Row label="Протокол" value={request.protocol} mono />
            <Row label="IP клиента" value={request.ip} mono />
            <Row label="Accept-Language" value={request.language} mono />
            <Row label="User-Agent" value={request.userAgent} mono />
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Процесс Node.js</h2>
          <dl className={styles.list}>
            <Row label="Версия Node.js" value={runtime.nodeVersion} mono />
            <Row label="Платформа" value={runtime.platform} mono />
            <Row label="Hostname" value={runtime.hostname} mono />
            <Row label="Uptime процесса" value={runtime.uptime} />
            <Row label="Память (RSS)" value={runtime.memory} />
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Сервер и браузер</h2>
          <dl className={styles.list}>
            <Row label="Время на сервере" value={formatTime(renderedAt)} />
            <Row label="Время в браузере" value={<ClientTime />} />
          </dl>
          <p className={styles.note}>
            Верхнее значение пришло в HTML с сервера и больше не меняется. Нижнее рисует клиентский
            компонент — оно появляется только после гидратации.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Проверить без браузера</h2>
          <pre className={styles.pre}>
            <code>{'curl -s http://localhost:3000 | grep -o \'data-request-id="[^"]*"\''}</code>
          </pre>
          <p className={styles.note}>
            Идентификатор уже есть в ответе сервера — значит, разметку собрал он, а не JavaScript в
            браузере. Те же данные в JSON отдаёт route handler{' '}
            <a href="/api/server-info">/api/server-info</a>, а{' '}
            <Link href="/posts">страница с данными из API</Link> показывает SSR с внешним запросом.
          </p>
        </section>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className={styles.row}>
      <dt className={styles.label}>{label}</dt>
      <dd className={mono ? `${styles.value} ${styles.valueMono}` : styles.value}>{value}</dd>
    </div>
  )
}
