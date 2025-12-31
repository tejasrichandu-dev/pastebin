import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function getCurrentTime(request: NextRequest): Date {
  if (process.env.TEST_MODE === '1') {
    const testNowMs = request.headers.get('x-test-now-ms')
    if (testNowMs) {
      const ms = parseInt(testNowMs, 10)
      if (!isNaN(ms)) {
        return new Date(ms)
      }
    }
  }
  return new Date()
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const now = getCurrentTime(request)

    // Find the paste
    const paste = await prisma.paste.findUnique({
      where: { id },
    })

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 })
    }

    // Check expiry
    if (paste.expiresAt && paste.expiresAt <= now) {
      return NextResponse.json({ error: 'Paste expired' }, { status: 404 })
    }

    // Check view limit
    if (paste.maxViews !== null && paste.viewsCount >= paste.maxViews) {
      return NextResponse.json({ error: 'View limit exceeded' }, { status: 404 })
    }

    // Increment views
    await prisma.paste.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    })

    // Calculate remaining views
    const remainingViews = paste.maxViews !== null ? paste.maxViews - paste.viewsCount - 1 : null

    return NextResponse.json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt?.toISOString() || null,
    })
  } catch (error) {
    console.error('Error fetching paste:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
