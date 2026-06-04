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
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-cyan-400"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      type="button"
    >
      {theme === 'dark' ? 'Claro' : 'Oscuro'}
    </button>
  )
}
