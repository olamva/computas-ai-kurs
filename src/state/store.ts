import { create } from 'zustand'
import { ChallengeResult, PlayerState } from '../types'
import { beer } from '../data/words'

interface GameStore {
  player: PlayerState
  currentWordId: string
  results: ChallengeResult[]
  lastEncounterAt?: number
  setMotionReduced: (value: boolean) => void
  setSeizureSafe: (value: boolean) => void
  selectWord: (wordId: string) => void
  recordResult: (result: ChallengeResult) => void
  unlockTier: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  player: {
    inventory: [],
    tier: 1,
    health: 3,
    streak: 0,
    settings: {
      motionReduced: false,
      seizureSafe: false,
      volume: 0.8,
    },
  },
  currentWordId: beer.id,
  results: [],
  setMotionReduced: (value) =>
    set((state) => ({
      player: { ...state.player, settings: { ...state.player.settings, motionReduced: value } },
    })),
  setSeizureSafe: (value) =>
    set((state) => ({
      player: { ...state.player, settings: { ...state.player.settings, seizureSafe: value } },
    })),
  selectWord: (wordId) => set({ currentWordId: wordId, lastEncounterAt: Date.now() }),
  recordResult: (result) =>
    set((state) => ({ results: [...state.results, result], player: { ...state.player, streak: state.player.streak + 1 } })),
  unlockTier: () =>
    set((state) => ({ player: { ...state.player, tier: Math.min(3, (state.player.tier + 1) as PlayerState['tier']) } })),
}))
