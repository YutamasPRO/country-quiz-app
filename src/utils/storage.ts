const highScoreKey = 'country-quiz-high-score'
const themeKey = 'country-quiz-theme'

export type Theme = 'light' | 'dark'

export function getHighScore() {
  return Number(localStorage.getItem(highScoreKey) ?? 0)
}

export function saveHighScore(score: number) {
  const currentScore = getHighScore()

  if (score > currentScore) {
    localStorage.setItem(highScoreKey, String(score))
  }
}

export function getStoredTheme(): Theme {
  return localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light'
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(themeKey, theme)
}
