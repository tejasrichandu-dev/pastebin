export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Lightweight DB check
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Database connection failed:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
