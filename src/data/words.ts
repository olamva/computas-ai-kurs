import { WordEntry } from '../types'
import beerAudio from '../assets/audio/Beer.m4a'

export const beer: WordEntry = {
  id: 'beer',
  word: 'beer',
  ipa: '/bɪr/',
  audioUrl: beerAudio,
  severity: 1,
  meaning: 'An alcoholic drink made from fermented grains, usually barley.',
  politeAlt: 'beverage',
  contexts: ['ordering', 'socializing', 'celebration'],
  challengeTypes: ['typing', 'dialogue', 'collect'],
  cooldownSec: 8,
}

export const words: WordEntry[] = [beer]
