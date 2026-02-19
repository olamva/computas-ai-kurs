import { useEffect, useMemo, useState } from 'react'
import BabylonFarm from '../game/BabylonFarm'
import { useGameStore } from '../state/store'
import { words } from '../data/words'

export default function Farm() {
  const { player, setMotionReduced, setSeizureSafe } = useGameStore()

  useEffect(() => {
    document.title = 'Profane Farm — Game'
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('motion-reduce', player.settings.motionReduced)
    root.classList.toggle('seizure-safe', player.settings.seizureSafe)
  }, [player.settings.motionReduced, player.settings.seizureSafe])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BabylonFarm />
    </div>
  )
}
