import { Suspense } from 'react'

import { formatTime } from '@/lib/server-info'

import styles from './page.module.css'

const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=6'

type Post = {
  id: number
  title: string
  body: string
}

export const metadata = {
  title: 'SSR с данными из API — Next.js на Timeweb Cloud Apps',
}

export default function PostsPage() {
  console.log('new-2')
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>Данные из внешнего API</h1>
        <p className={styles.lead}>
          Запрос к API уходит с сервера, а не из браузера: ключи и адреса бэкенда не попадают в
          клиентский бандл. Список обёрнут в <code>&lt;Suspense&gt;</code>, поэтому заголовок
          страницы уходит в браузер сразу, а карточки догружаются, когда придёт ответ.
        </p>
      </section>

      <Suspense fallback={<PostsSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}

async function PostList() {
  const result = await getPosts()

  if (!result) {
    return (
      <p className={styles.error}>
        Не удалось получить данные из <code>{API_URL}</code>. Проверьте доступ в интернет с сервера
        приложения.
      </p>
    )
  }

  return (
    <>
      <p className={styles.meta}>
        Получено {result.posts.length} записей за {result.durationMs} мс, время ответа сервера:{' '}
        {formatTime(result.fetchedAt)}
      </p>
      <ul className={styles.list}>
        {result.posts.map((post) => (
          <li key={post.id} className={styles.item}>
            <h2 className={styles.itemTitle}>{post.title}</h2>
            <p className={styles.itemBody}>{post.body}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

async function getPosts() {
  const startedAt = Date.now()

  try {
    // В Next.js 16 fetch не кешируется по умолчанию — `no-store` оставлен
    // явно, чтобы было видно: запрос уходит при каждом рендере страницы.
    const response = await fetch(API_URL, { cache: 'no-store' })

    if (!response.ok) {
      return null
    }

    return {
      posts: (await response.json()) as Post[],
      durationMs: Date.now() - startedAt,
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

function PostsSkeleton() {
  return (
    <ul className={styles.list} aria-hidden="true">
      {[0, 1, 2, 3].map((index) => (
        <li key={index} className={`${styles.item} ${styles.skeleton}`} />
      ))}
    </ul>
  )
}
