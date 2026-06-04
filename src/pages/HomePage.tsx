import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ui/ThemeToggle'
import { getHighScore } from '../utils/storage'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-5">
        <header className="flex items-center justify-between">
          <p className="text-sm font-black uppercase tracking-wide text-indigo-700 dark:text-cyan-300">
            Country Quiz
          </p>
          <ThemeToggle />
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
              DevChallenges Frontend
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">
              Adivina paises antes de que el reloj llegue a cero.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Responde seis preguntas de capitales, conserva tu mejor racha en el navegador y
              alterna el tema de la interfaz.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                to="/quiz"
              >
                Iniciar quiz
              </Link>
              <span className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:text-slate-200">
                High score: {getHighScore()}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-2 gap-3">
              {['15s por pregunta', 'Sonidos sutiles', 'Modo oscuro', 'React Router'].map(
                (feature) => (
                  <div
                    className="min-h-24 rounded-md bg-slate-100 p-4 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    key={feature}
                  >
                    {feature}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
