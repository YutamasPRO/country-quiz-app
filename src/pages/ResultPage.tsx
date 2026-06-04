import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ThemeToggle from '../components/ui/ThemeToggle'
import { getHighScore, saveHighScore } from '../utils/storage'

type ResultState = {
  score?: number
  total?: number
}

export default function ResultPage() {
  const location = useLocation()
  const state = (location.state ?? {}) as ResultState
  const score = state.score ?? 0
  const total = state.total ?? 6
  const highScore = Math.max(score, getHighScore())

  useEffect(() => {
    saveHighScore(score)
  }, [score])

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-5 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <Link className="text-sm font-black text-indigo-700 dark:text-cyan-300" to="/">
          Country Quiz
        </Link>
        <ThemeToggle />
      </div>

      <section className="mx-auto mt-16 w-full max-w-xl rounded-lg border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
          Resultado final
        </p>
        <h1 className="mt-3 text-5xl font-black text-slate-950 dark:text-white">
          {score}/{total}
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Mejor puntaje guardado: <strong>{highScore}</strong>
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700 dark:bg-cyan-400 dark:text-slate-950"
            to="/quiz"
          >
            Jugar otra vez
          </Link>
          <Link
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 dark:border-slate-700 dark:text-slate-100"
            to="/"
          >
            Inicio
          </Link>
        </div>
      </section>
    </main>
  )
}
