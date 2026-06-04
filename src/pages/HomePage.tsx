import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ui/ThemeToggle'
import { getHighScore } from '../utils/storage'

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-4 text-slate-900 sm:px-6 sm:py-6 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <p className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-indigo-700 shadow-lg shadow-slate-950/5 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-cyan-300">
            Country Quiz
          </p>
          <ThemeToggle />
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-10">
          <div className="order-1">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              DevChallenges Frontend
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl dark:text-white md:text-6xl">
              Adivina paises antes de que el reloj llegue a cero.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
              Responde diez preguntas de capitales, conserva tu mejor racha en el navegador y
              alterna el tema de la interfaz.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-400/20 dark:hover:bg-cyan-300"
                to="/quiz"
              >
                Iniciar quiz
              </Link>
              <span className="inline-flex min-h-12 items-center rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-950/5 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-200">
                High score: {getHighScore()}
              </span>
            </div>
          </div>

          <div className="order-2 rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/75 md:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Quiz Snapshot
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                  Reto listo para jugar
                </h2>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 px-4 py-3 text-right text-white dark:from-cyan-400 dark:to-emerald-400 dark:text-slate-950">
                <p className="text-xs font-black uppercase tracking-[0.25em]">Meta</p>
                <p className="text-2xl font-black">10/10</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['10 preguntas', 'Recorre el quiz completo sin perder respuestas.'],
                ['15s por pregunta', 'Cada decisión cuenta cuando el reloj aprieta.'],
                ['Modo oscuro', 'Tema adaptable para estudiar o presentar.'],
                ['React Router', 'Flujo SPA limpio entre home, quiz y resultados.'],
              ].map(([feature, description]) => (
                <div
                  className="min-h-28 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"
                  key={feature}
                >
                  <p className="text-sm font-black text-slate-900 dark:text-white">{feature}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
