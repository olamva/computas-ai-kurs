<<<<<<< ours
import { Link } from 'react-router-dom'
import HeroCanvas from '../three/HeroCanvas'
import { useEffect } from 'react'

const features = [
  'Grotesque dusk farm rendered in ThreeJS',
  'BabylonJS free-roam with curse encounters',
  'Full-strength profanity curriculum (no slurs)',
  'Motion reduction + seizure-safe modes',
]

export default function Landing() {
  useEffect(() => {
    document.title = 'Profane Farm — Landing'
  }, [])

  return (
    <main className="min-h-screen grid-hero items-center px-6 py-10 lg:px-14 lg:py-16 relative overflow-hidden">
      <div className="ribbon">Explicit Content 18+</div>
      <section className="relative z-10 space-y-6">
        <p className="pill">Learn English the spicy way</p>
        <h1 className="text-5xl md:text-6xl font-black leading-tight text-neon drop-shadow-2xl">
          Trondheim Profane Farm
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Wander a surreal Nordic farm, harvest obscene vocabulary, and practice real usage with contextual mini-challenges. Built with ThreeJS + BabylonJS, styled in Tailwind for a moody brutalist vibe.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="cta" to="/farm">Enter the farm</Link>
          <a
            className="px-5 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            href="#curriculum"
          >
            View curriculum
          </a>
        </div>
        <div className="grid md:grid-cols-2 gap-3" id="curriculum">
          {features.map((f) => (
            <div key={f} className="card-brutal glass border-glow">
              <p className="font-semibold">{f}</p>
              <p className="text-sm text-muted-foreground">
                Hyper-focused on beauty and grotesque language — with safeguards against hate speech.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="h-[70vh] lg:h-[80vh] relative">
        <div className="absolute inset-0 rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
          <HeroCanvas />
          <div className="absolute left-4 bottom-4 glass px-3 py-2 text-xs uppercase tracking-wide flex gap-2 items-center">
            <span className="size-2 rounded-full bg-primary animate-ping"></span>
            Interactive hero — mouse to orbit, scroll to zoom
          </div>
        </div>
      </section>
    </main>
  )
=======
import Menu from '../screens/menu/Menu'

export default function Landing() {
  return <Menu />
>>>>>>> theirs
}
