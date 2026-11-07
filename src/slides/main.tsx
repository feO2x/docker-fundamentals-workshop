import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'reveal.js/reveal.css'
import '../tokens.css'
import './slides.css'
import SlidesApp from './SlidesApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SlidesApp />
  </StrictMode>,
)
