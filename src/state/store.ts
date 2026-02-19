import { create } from 'zustand'
import { ChallengeResult, PlayerState, WordEntry } from '../types'
import { words as wordList } from '../data/words'

interface GameStore {
  words: WordEntry[]
  player: PlayerState
  currentWordId: string | null
  results: ChallengeResult[]
  lastEncounterAt?: number
  setMotionReduced: (value: boolean) => void
  setSeizureSafe: (value: boolean) => void
  nextWord: (id: string) => void
  recordResult: (result: ChallengeResult) => void
  unlockTier: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  words: wordList,
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
  currentWordId: null,
  results: [],
  setMotionReduced: (value) =>
    set((state) => ({
      player: { ...state.player, settings: { ...state.player.settings, motionReduced: value } },
    })),
  setSeizureSafe: (value) =>
    set((state) => ({
      player: { ...state.player, settings: { ...state.player.settings, seizureSafe: value } },
    })),
  nextWord: (id) => set({ currentWordId: id, lastEncounterAt: Date.now() }),
  recordResult: (result) =>
    set((state) => ({ results: [...state.results, result], player: { ...state.player, streak: state.player.streak + 1 } })),
  unlockTier: () =>
    set((state) => ({ player: { ...state.player, tier: Math.min(3, (state.player.tier + 1) as PlayerState['tier']) } })),
}))
