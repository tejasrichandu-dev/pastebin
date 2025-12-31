import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection by attempting to connect
    await prisma.$connect()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Database connection failed:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
