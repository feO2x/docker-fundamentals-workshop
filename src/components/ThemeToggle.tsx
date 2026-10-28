import { useState } from 'react'
import { getTheme, setTheme, type Theme } from '../lib/theme'
import './ThemeToggle.css'

interface Props {
  className?: string
}

/** Schaltet zwischen hellem und dunklem Design um. Das Symbol zeigt das Ziel. */
export function ThemeToggle({ className }: Props) {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const label =
    next === 'light' ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'

  function toggle() {
    setTheme(next)
    setThemeState(next)
  }

  return (
    <button
      type="button"
      className={className ? `theme-toggle ${className}` : 'theme-toggle'}
      onClick={toggle}
      // Kein Fokus per Maus: Sonst schaltet die Leertaste, mit der Reveal
      // weiterblättert, das Design erneut um. Per Tastatur bleibt er fokussierbar.
      onMouseDown={(event) => event.preventDefault()}
      aria-label={label}
      title={label}
    >
      {next === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  )
}
