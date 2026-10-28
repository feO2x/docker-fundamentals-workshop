export type Theme = 'light' | 'dark'

/**
 * Schlüssel im localStorage. Agenda und Folien teilen sich den Origin und damit
 * die Auswahl. Das Inline-Skript in index.html und slides.html liest denselben
 * Schlüssel, um das Design schon vor dem ersten Rendern zu setzen.
 */
export const THEME_STORAGE_KEY = 'docker-fundamentals-theme'

/** Liest das aktive Design vom <html>-Element. */
export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Setzt das Design und merkt es sich für spätere Besuche. */
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ohne Speicher (z. B. privates Fenster) gilt die Wahl nur für diese Seite.
  }
}
