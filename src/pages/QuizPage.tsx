import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QuestionCard from '../components/quiz/QuestionCard'
import ThemeToggle from '../components/ui/ThemeToggle'
import { getCountries } from '../services/countriesApi'
import { playFeedback } from '../utils/audioFeedback'
import type { Question } from '../utils/quizUtils'
import { createQuestions } from '../utils/quizUtils'

const secondsPerQuestion = 15

type QuestionProgress = {
  selectedAnswer: string | null
  secondsLeft: number
}

export default function QuizPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState<QuestionProgress[]>([])

  const currentQuestion = useMemo(() => questions[currentIndex], [currentIndex, questions])
  const currentProgress = progress[currentIndex]
  const answeredCount = useMemo(
    () => progress.filter((item) => item.selectedAnswer !== null).length,
    [progress],
  )
  const isQuizComplete = questions.length > 0 && answeredCount === questions.length
  const score = useMemo(
    () =>
      questions.reduce((total, question, index) => {
        return progress[index]?.selectedAnswer === question.answer ? total + 1 : total
      }, 0),
    [progress, questions],
  )

  const loadQuiz = useCallback(() => {
    let isActive = true

    setIsLoading(true)
    setError('')
    setStatusMessage('')
    setCurrentIndex(0)
    setQuestions([])
    setProgress([])

    getCountries()
      .then(({ countries, message, source }) => {
        if (isActive) {
          const nextQuestions = createQuestions(countries)

          setQuestions(nextQuestions)
          setProgress(
            nextQuestions.map(() => ({
              selectedAnswer: null,
              secondsLeft: secondsPerQuestion,
            })),
          )

          if (source === 'fallback' && message) {
            setStatusMessage(message)
          }
        }
      })
      .catch(() => {
        if (isActive) {
          setError('No pudimos preparar el quiz. Intentalo nuevamente.')
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    const cleanup = loadQuiz()

    return cleanup
  }, [loadQuiz])

  const goToNextQuestion = useCallback((nextScore: number, nextProgress: QuestionProgress[]) => {
    window.setTimeout(() => {
      const isComplete = nextProgress.every((item) => item.selectedAnswer !== null)

      if (isComplete) {
        navigate('/result', { state: { score: nextScore, total: questions.length } })
        return
      }

      const nextUnansweredIndex = nextProgress.findIndex((item) => item.selectedAnswer === null)

      if (nextUnansweredIndex >= 0) {
        setCurrentIndex(nextUnansweredIndex)
        return
      }

      setCurrentIndex((current) => Math.min(current + 1, questions.length - 1))
    }, 650)
  }, [currentIndex, navigate, questions.length])

  const handleAnswer = useCallback((answer: string) => {
    if (!currentQuestion || currentProgress?.selectedAnswer) {
      return
    }

    const isCorrect = answer === currentQuestion.answer
    const nextScore = isCorrect ? score + 1 : score

    let nextProgress: QuestionProgress[] = []

    setProgress((current) => {
      nextProgress = current.map((item, index) =>
        index === currentIndex
          ? {
              ...item,
              selectedAnswer: answer,
            }
          : item,
      )

      return nextProgress
    })
    playFeedback(isCorrect ? 'correct' : 'wrong')
    goToNextQuestion(nextScore, nextProgress)
  }, [currentIndex, currentProgress?.selectedAnswer, currentQuestion, goToNextQuestion, score])

  useEffect(() => {
    if (
      isLoading ||
      error ||
      currentProgress?.selectedAnswer ||
      !currentQuestion ||
      !currentProgress
    ) {
      return undefined
    }

    if (currentProgress.secondsLeft === 0) {
      const timeoutId = window.setTimeout(() => handleAnswer('__timeout__'), 0)

      return () => window.clearTimeout(timeoutId)
    }

    const intervalId = window.setInterval(() => {
      setProgress((current) =>
        current.map((item, index) =>
          index === currentIndex
            ? {
                ...item,
                secondsLeft: Math.max(item.secondsLeft - 1, 0),
              }
            : item,
        ),
      )
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [currentIndex, currentProgress, currentQuestion, error, handleAnswer, isLoading])

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center px-5 text-slate-900 dark:text-white">
        <section className="w-full max-w-md rounded-[1.75rem] border border-white/60 bg-white/80 p-6 text-center shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/75">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-cyan-300" />
          <h1 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
            Preparando el quiz
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Estamos cargando paises y generando las preguntas para esta ronda.
          </p>
        </section>
      </main>
    )
  }

  if (error || !currentQuestion) {
    return (
      <main className="grid min-h-screen place-items-center px-5 text-slate-900 dark:text-white">
        <section className="rounded-[1.75rem] border border-white/60 bg-white/80 p-6 text-center shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/75">
          <h1 className="text-2xl font-black">Error</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {error || 'No hay preguntas disponibles.'}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-400/20"
              onClick={loadQuiz}
              type="button"
            >
              Reintentar
            </button>
            <Link
              className="rounded-2xl border border-slate-300 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              to="/"
            >
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-4 text-slate-900 sm:px-6 sm:py-6 dark:text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-indigo-700 shadow-lg shadow-slate-950/5 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-cyan-300"
          to="/"
        >
          Country Quiz
        </Link>
        <ThemeToggle />
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-6xl gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/75">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Progreso
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-1">
            <div className="rounded-2xl bg-slate-100/90 p-4 dark:bg-slate-900/90">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Puntaje
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{score}</p>
            </div>
            <div className="rounded-2xl bg-slate-100/90 p-4 dark:bg-slate-900/90">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Respondidas
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                {answeredCount}/{questions.length}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Puedes navegar entre preguntas y revisar tu progreso desde cualquier punto del quiz.
          </p>
          {statusMessage ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              {statusMessage}
            </div>
          ) : null}
        </aside>

        <div className="min-w-0">
          <QuestionCard
            currentIndex={currentIndex}
            isQuizComplete={isQuizComplete}
            onChangeQuestion={setCurrentIndex}
            onAnswer={handleAnswer}
            question={currentQuestion}
            progress={progress}
            seconds={currentProgress?.secondsLeft ?? secondsPerQuestion}
            selectedAnswer={currentProgress?.selectedAnswer ?? null}
            total={questions.length}
          />
        </div>
      </div>
    </main>
  )
}
