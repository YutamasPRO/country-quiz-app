import { useEffect, useState } from 'react'
import { getStoredTheme, saveTheme, type Theme } from '../../utils/storage'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  return (
    <button
      aria-label="Cambiar tema"
      className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-lg shadow-slate-950/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-400 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-slate-100 dark:hover:border-cyan-400"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      type="button"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
      {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
    </button>
  )
}
