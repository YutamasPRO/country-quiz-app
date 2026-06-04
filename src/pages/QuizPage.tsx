import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QuestionCard from '../components/quiz/QuestionCard'
import ThemeToggle from '../components/ui/ThemeToggle'
import { getCountries } from '../services/countriesApi'
import type { Question } from '../utils/quizUtils'
import { createQuestions } from '../utils/quizUtils'

const secondsPerQuestion = 15

type QuestionProgress = {
  selectedAnswer: string | null
  secondsLeft: number
}

function playFeedback(type: 'correct' | 'wrong') {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

  if (!AudioContextConstructor) {
    return
  }

  const audioContext = new AudioContextConstructor()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.frequency.value = type === 'correct' ? 660 : 180
  oscillator.type = 'sine'
  gain.gain.setValueAtTime(0.08, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.18)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.18)
}

export default function QuizPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
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

  useEffect(() => {
    let isActive = true

    getCountries()
      .then((countries) => {
        if (isActive) {
          const nextQuestions = createQuestions(countries)

          setQuestions(nextQuestions)
          setProgress(
            nextQuestions.map(() => ({
              selectedAnswer: null,
              secondsLeft: secondsPerQuestion,
            })),
          )
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
    if (isLoading || error || currentProgress?.selectedAnswer || !currentQuestion || !currentProgress) {
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
      <main className="grid min-h-screen place-items-center bg-slate-100 px-5 text-slate-900 dark:bg-slate-950 dark:text-white">
        <p className="rounded-lg bg-white px-5 py-4 font-bold shadow dark:bg-slate-900">
          Cargando paises...
        </p>
      </main>
    )
  }

  if (error || !currentQuestion) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-5 text-slate-900 dark:bg-slate-950 dark:text-white">
        <section className="rounded-lg bg-white p-6 text-center shadow dark:bg-slate-900">
          <h1 className="text-2xl font-black">Error</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {error || 'No hay preguntas disponibles.'}
          </p>
          <Link className="mt-5 inline-flex font-bold text-indigo-600 dark:text-cyan-300" to="/">
            Volver al inicio
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-5 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link className="text-sm font-black text-indigo-700 dark:text-cyan-300" to="/">
          Country Quiz
        </Link>
        <ThemeToggle />
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col items-center gap-4">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Puntaje: {score}</p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Respondidas: {answeredCount}/{questions.length}
        </p>
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
    </main>
  )
}
