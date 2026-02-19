import { useEffect, useMemo, useState } from "react"
import BabylonFarm from "../game/BabylonFarm"
import { useGameStore } from "../state/store"
import { words } from "../data/words"

export default function Farm() {
  const { player, currentWordId, lastEncounterAt, setMotionReduced, setSeizureSafe } = useGameStore()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [])

  const currentWord = useMemo(
    () => words.find((word) => word.id === currentWordId),
    [currentWordId]
  )
  const showWord = currentWord && lastEncounterAt && now - lastEncounterAt < 3000

  useEffect(() => {
    document.title = "Profane Farm — Game"
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("motion-reduce", player.settings.motionReduced)
    root.classList.toggle("seizure-safe", player.settings.seizureSafe)
  }, [player.settings.motionReduced, player.settings.seizureSafe])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BabylonFarm />
      {showWord ? (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 text-white px-6 py-3 text-xl font-semibold tracking-wide shadow-lg">
          {currentWord.word}
        </div>
      ) : null}
    </div>
  )
}
