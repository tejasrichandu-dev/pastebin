import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import styles from './Paste.module.css'

function getCurrentTime(): Date {
  const headersList = headers()
  if (process.env.TEST_MODE === '1') {
    const testNowMs = headersList.get('x-test-now-ms')
    if (testNowMs) {
      const ms = parseInt(testNowMs, 10)
      if (!isNaN(ms)) {
        return new Date(ms)
      }
    }
  }
  return new Date()
}

interface PageProps {
  params: { id: string }
}

export default async function PastePage({ params }: PageProps) {
  const { id } = params
  const now = getCurrentTime()

  try {
    const paste = await prisma.paste.findUnique({
      where: { id },
    })

    if (!paste) {
      notFound()
    }

    // Check expiry
    if (paste.expiresAt && paste.expiresAt <= now) {
      notFound()
    }

    // Check view limit
    if (paste.maxViews !== null && paste.viewsCount >= paste.maxViews) {
      notFound()
    }

    // Increment views
    await prisma.paste.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    })

    const remainingViews = paste.maxViews !== null ? paste.maxViews - paste.viewsCount - 1 : null
    const expiresAt = paste.expiresAt ? paste.expiresAt.toLocaleString() : null

    return (
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Paste #{id.slice(0, 8)}...</h1>
            <div className={styles.stats}>
              {remainingViews !== null && (
                <span>Views left: {remainingViews}</span>
              )}
              {expiresAt && (
                <span>Expires: {expiresAt}</span>
              )}
            </div>
          </header>

          <pre className={styles.pasteContent}>
            {paste.content}
          </pre>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching paste:', error)
    notFound()
  }
}
