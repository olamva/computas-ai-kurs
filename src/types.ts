export type ChallengeType = 'collect' | 'dialogue' | 'rhythm' | 'typing'

export interface WordEntry {
  id: string
  word: string
  ipa: string
  audioUrl: string
  severity: 1 | 2 | 3
  meaning: string
  politeAlt: string
  contexts: string[]
  challengeTypes: ChallengeType[]
  cooldownSec: number
}

export interface AnimalEntity {
  id: string
  name: string
  words?: WordEntry[]
  soundUrl?: string
  cooldownSec?: number
}

export interface ChallengeResult {
  wordId: string
  type: ChallengeType
  score: number
  accuracy: number
  completedAt: string
}

export interface PlayerState {
  inventory: string[]
  tier: 1 | 2 | 3
  health: number
  streak: number
  settings: {
    motionReduced: boolean
    seizureSafe: boolean
    volume: number
  }
}
