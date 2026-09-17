import { NextResponse } from 'next/server'

import { getServerInfo } from '@/lib/server-info'

/** Route handler: те же серверные данные, но в JSON. */
export async function GET() {
  const info = await getServerInfo()

  return NextResponse.json(info, {
    headers: { 'cache-control': 'no-store' },
  })
}
