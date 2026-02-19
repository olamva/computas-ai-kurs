import { useEffect, useMemo } from 'react'
import BabylonFarm from '../game/BabylonFarm'
import { useGameStore } from '../state/store'
import { beer } from '../data/words'

export default function Farm() {
  const { player, setMotionReduced, setSeizureSafe } = useGameStore()

  useEffect(() => {
    document.title = 'Beer Farm — Game'
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('motion-reduce', player.settings.motionReduced)
    root.classList.toggle('seizure-safe', player.settings.seizureSafe)
  }, [player.settings.motionReduced, player.settings.seizureSafe])

  const settingsToggles = useMemo(
    () => [
      {
        label: 'Motion reduction',
        value: player.settings.motionReduced,
        handler: setMotionReduced,
      },
      {
        label: 'Seizure-safe visuals',
        value: player.settings.seizureSafe,
        handler: setSeizureSafe,
      },
    ],
    [player.settings.motionReduced, player.settings.seizureSafe, setMotionReduced, setSeizureSafe]
  )

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
        <div>
          <p className="pill mb-1">Beer learning</p>
          <h2 className="text-2xl font-bold">Farm walk — Tier {player.tier}</h2>
        </div>
        <div className="flex items-center gap-3">
          {settingsToggles.map((toggle) => (
            <label key={toggle.label} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-primary"
                checked={toggle.value}
                onChange={(e) => toggle.handler(e.target.checked)}
              />
              {toggle.label}
            </label>
          ))}
        </div>
      </div>

      <BabylonFarm />

      <aside className="absolute right-4 top-24 max-w-sm z-30 space-y-3">
        <div className="card-brutal glass border-glow">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Word spotlight</p>
          <h3 className="text-3xl font-black text-neon">{beer.word}</h3>
          <p className="text-muted-foreground text-sm">{beer.meaning}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {beer.contexts.map((ctx) => (
              <span key={ctx} className="pill">{ctx}</span>
            ))}
          </div>
        </div>
        <div className="card-brutal glass border-glow text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Controls</p>
          <ul className="list-disc list-inside space-y-1">
            <li>WASD: walk the farm</li>
            <li>E: interact with beer crop</li>
            <li>Space: jump pulse</li>
            <li>F: toggle fullscreen</li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
