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
  const total = state.total ?? 10
  const highScore = Math.max(score, getHighScore())

  useEffect(() => {
    saveHighScore(score)
  }, [score])

  return (
    <main className="min-h-screen px-4 py-4 text-slate-900 sm:px-6 sm:py-6 dark:text-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <Link
          className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-indigo-700 shadow-lg shadow-slate-950/5 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-cyan-300"
          to="/"
        >
          Country Quiz
        </Link>
        <ThemeToggle />
      </div>

      <section className="mx-auto mt-10 w-full max-w-2xl rounded-[2rem] border border-white/60 bg-white/80 p-6 text-center shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 sm:mt-16 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Resultado final
        </p>
        <h1 className="mt-4 text-5xl font-black text-slate-950 dark:text-white sm:text-6xl">
          {score}/{total}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Completaste el recorrido completo del quiz.
        </p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Mejor puntaje guardado: <strong>{highScore}</strong>
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-400/20"
            to="/quiz"
          >
            Jugar otra vez
          </Link>
          <Link
            className="rounded-2xl border border-slate-300 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            to="/"
          >
            Inicio
          </Link>
        </div>
      </section>
    </main>
  )
}
