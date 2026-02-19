import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles.css'
import Landing from './routes/Landing'
import Farm from './routes/Farm'

function AgeGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const ok = localStorage.getItem('profane-farm-18') === 'yes'
    if (ok) setAllowed(true)
  }, [])

  const approve = () => {
    localStorage.setItem('profane-farm-18', 'yes')
    setAllowed(true)
  }

  if (allowed) return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full card-brutal glass border-glow">
        <p className="pill mb-3">Explicit content</p>
        <h1 className="text-2xl font-bold mb-2 text-neon">Profanity ahead</h1>
        <p className="text-sm text-muted-foreground mb-4">
          This experience contains strong English curse words (no hate speech). You must be 18+ to enter.
        </p>
        <div className="flex gap-3">
          <button className="cta" onClick={approve}>I am 18+ — Enter</button>
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/farm"
          element={
            <AgeGate>
              <Farm />
            </AgeGate>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
