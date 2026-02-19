import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface AgeCheckProps {
  children: ReactNode
}

export default function AgeCheck({ children }: AgeCheckProps) {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const ok = localStorage.getItem('under-13-ready') === 'yes'
    if (ok) setAllowed(true)
  }, [])

  const approve = () => {
    localStorage.setItem('under-13-ready', 'yes')
    setAllowed(true)
  }

  if (allowed) return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full card-brutal glass border-glow">
        <p className="pill mb-3">Age check</p>
        <h1 className="text-2xl font-bold mb-2 text-neon">Ready to learn</h1>
        <p className="text-sm text-muted-foreground mb-4">
          You must be under 13 and ready to learn.
        </p>
        <div className="flex gap-3">
          <button className="cta" onClick={approve}>I am under 13 — Enter</button>
          <button
            className="px-5 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            onClick={() => {
              window.location.href = 'https://www.gutenberg.org/'
            }}
          >
            Nope
          </button>
        </div>
      </div>
    </div>
  )
}
