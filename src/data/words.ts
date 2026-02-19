import { WordEntry } from '../types'

export const beer: WordEntry = {
  id: 'beer',
  word: 'beer',
  ipa: '/bɪr/',
  audioUrl: '/audio/beer.mp3',
  severity: 1,
  meaning: 'An alcoholic drink made from fermented grains, usually barley.',
  politeAlt: 'beverage',
  contexts: ['ordering', 'socializing', 'celebration'],
  challengeTypes: ['typing', 'dialogue', 'collect'],
  cooldownSec: 8,
}

export const words: WordEntry[] = [beer]
