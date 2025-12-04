'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PreviewBanner() {
  const pathname = usePathname()
  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-center py-2 z-50">
      <p className="text-sm">
        🧪 Preview Mode Enabled — Viewing Drafts
        {' '}
        <Link
          href={`/api/exit-preview?redirect=${pathname}`}
          className="font-semibold underline ml-2"
        >
          Exit Preview
        </Link>
      </p>
    </div>
  )
}
