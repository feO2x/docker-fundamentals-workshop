import { Deck } from '@revealjs/react'
import type { RevealConfig } from 'reveal.js'
import RevealHighlight from 'reveal.js/plugin/highlight'
import { ThemeToggle } from '../components/ThemeToggle'
import { Opening } from './blocks/Opening'
import { WarumDockerBlock } from './blocks/WarumDockerBlock'

// Feste 16:9-Leinwand, die Reveal auf das Browserfenster skaliert.
const config: RevealConfig = {
  hash: true,
  width: 1280,
  height: 720,
  center: false,
  // Jeder Block ist ein vertikaler Stack (siehe BlockStack). Mit 'linear' laufen ←/→
  // trotzdem durch alle Folien, statt den Rest eines Blocks zu überspringen.
  navigationMode: 'linear',
}

// Plugins liest der Deck nur beim ersten Rendern - daher eine feste Liste.
const plugins = [RevealHighlight]

export default function SlidesApp() {
  return (
    <>
      {/* Außerhalb des Decks, damit Reveal den Knopf nicht mitskaliert. */}
      <ThemeToggle className="slides-theme-toggle" />
      <Deck config={config} plugins={plugins}>
        <Opening />
        <WarumDockerBlock />
      </Deck>
    </>
  )
}
