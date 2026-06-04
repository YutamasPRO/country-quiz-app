import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QuestionCard from '../components/quiz/QuestionCard'
import ThemeToggle from '../components/ui/ThemeToggle'
import { getCountries } from '../services/countriesApi'
import type { Question } from '../utils/quizUtils'
import { createQuestions } from '../utils/quizUtils'

const secondsPerQuestion = 15

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
  const [score, setScore] = useState(0)
  const [seconds, setSeconds] = useState(secondsPerQuestion)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentQuestion = useMemo(() => questions[currentIndex], [currentIndex, questions])

  useEffect(() => {
    let isActive = true

    getCountries()
      .then((countries) => {
        if (isActive) {
          setQuestions(createQuestions(countries))
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

  const goToNextQuestion = useCallback((nextScore: number) => {
    window.setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        navigate('/result', { state: { score: nextScore, total: questions.length } })
        return
      }

      setCurrentIndex((current) => current + 1)
      setSelectedAnswer(null)
      setSeconds(secondsPerQuestion)
    }, 650)
  }, [currentIndex, navigate, questions.length])

  const handleAnswer = useCallback((answer: string) => {
    if (!currentQuestion || selectedAnswer) {
      return
    }

    const isCorrect = answer === currentQuestion.answer
    const nextScore = isCorrect ? score + 1 : score

    setSelectedAnswer(answer)
    setScore(nextScore)
    playFeedback(isCorrect ? 'correct' : 'wrong')
    goToNextQuestion(nextScore)
  }, [currentQuestion, goToNextQuestion, score, selectedAnswer])

  useEffect(() => {
    if (isLoading || error || selectedAnswer || !currentQuestion) {
      return undefined
    }

    if (seconds === 0) {
      const timeoutId = window.setTimeout(() => handleAnswer('__timeout__'), 0)

      return () => window.clearTimeout(timeoutId)
    }

    const intervalId = window.setInterval(() => {
      setSeconds((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [currentQuestion, error, handleAnswer, isLoading, seconds, selectedAnswer])

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
        <QuestionCard
          currentIndex={currentIndex}
          onAnswer={handleAnswer}
          question={currentQuestion}
          seconds={seconds}
          selectedAnswer={selectedAnswer}
          total={questions.length}
        />
      </div>
    </main>
  )
}
