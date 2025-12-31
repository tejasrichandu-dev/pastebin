export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, ttl_seconds, max_views } = body

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: 'ttl_seconds must be an integer >= 1' },
        { status: 400 }
      )
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        { error: 'max_views must be an integer >= 1' },
        { status: 400 }
      )
    }

    const id = nanoid(10)
    const createdAt = new Date()
    const expiresAt = ttl_seconds
      ? new Date(createdAt.getTime() + ttl_seconds * 1000)
      : null

    await prisma.paste.create({
      data: {
        id,
        content,
        ttlSeconds: ttl_seconds,
        maxViews: max_views,
        expiresAt,
      },
    })

    const host = headers().get('host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const url = `${protocol}://${host}/p/${id}`

    return NextResponse.json({ id, url })
  } catch (error) {
    console.error('Error creating paste:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
