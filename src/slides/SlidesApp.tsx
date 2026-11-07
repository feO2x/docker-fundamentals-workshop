import { Deck } from '@revealjs/react'
import type { RevealConfig } from 'reveal.js'
import RevealHighlight from 'reveal.js/plugin/highlight'
import { ThemeToggle } from '../components/ThemeToggle'
import { AbschlussBlock } from './blocks/AbschlussBlock'
import { AusblickBlock } from './blocks/AusblickBlock'
import { DockerfileBlock } from './blocks/DockerfileBlock'
import { KonzepteBlock } from './blocks/KonzepteBlock'
import { LayerBlock } from './blocks/LayerBlock'
import { LebenszyklusBlock } from './blocks/LebenszyklusBlock'
import { MultiStageBlock } from './blocks/MultiStageBlock'
import { NukeExtensionsBlock } from './blocks/NukeExtensionsBlock'
import { Opening } from './blocks/Opening'
import { RegistryBlock } from './blocks/RegistryBlock'
import { VolumesBlock } from './blocks/VolumesBlock'
import { WarumDockerBlock } from './blocks/WarumDockerBlock'
import { BreakSlide } from './BreakSlide'

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
        <KonzepteBlock />
        <LebenszyklusBlock />
        <VolumesBlock />
        <BreakSlide blockId="pause-1">
          Danach baut ihr eure eigenen Images. Räumt vorher auf:{' '}
          <code className="nowrap">docker rm -f web</code>.
        </BreakSlide>
        <DockerfileBlock />
        <LayerBlock />
        <RegistryBlock />
        <BreakSlide blockId="pause-2">
          Lasst die Registry laufen, die braucht ihr in der Abschlussübung wieder.
        </BreakSlide>
        <MultiStageBlock />
        <NukeExtensionsBlock />
        <AbschlussBlock />
        <AusblickBlock />
      </Deck>
    </>
  )
}
