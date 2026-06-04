import type { Question } from '../../utils/quizUtils'
import OptionButton from './OptionButton'
import Timer from './Timer'

type QuestionCardProps = {
  question: Question
  currentIndex: number
  total: number
  seconds: number
  isQuizComplete: boolean
  progress: Array<{ selectedAnswer: string | null }>
  selectedAnswer: string | null
  onAnswer: (answer: string) => void
  onChangeQuestion: (index: number) => void
}

export default function QuestionCard({
  question,
  currentIndex,
  isQuizComplete,
  onChangeQuestion,
  progress,
  total,
  seconds,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
  return (
    <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:bg-cyan-400/10 dark:text-cyan-200">
          Pregunta {currentIndex + 1} de {total}
        </span>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {question.country.region}
        </span>
      </div>

      <img
        alt={`Bandera de ${question.country.name}`}
        className="mb-5 h-28 w-full rounded-md object-contain"
        src={question.country.flag}
      />

      <h1 className="mb-6 text-2xl font-bold leading-tight text-slate-950 dark:text-white">
        {question.prompt}
      </h1>

      <div className="mb-6">
        <Timer seconds={seconds} />
      </div>

      <div className="mb-6 grid grid-cols-5 gap-2 sm:grid-cols-6">
        {progress.map((item, index) => {
          const isCurrent = index === currentIndex
          const isAnswered = item.selectedAnswer !== null

          return (
            <button
              className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                isCurrent
                  ? 'border-indigo-600 bg-indigo-600 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950'
                  : isAnswered
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-200'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400'
              }`}
              key={index}
              onClick={() => onChangeQuestion(index)}
              type="button"
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      {isQuizComplete ? (
        <p className="mb-6 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-200">
          Completaste las {total} preguntas del quiz.
        </p>
      ) : null}

      <div className="grid gap-3">
        {question.options.map((option) => {
          const state =
            selectedAnswer === null
              ? 'idle'
              : option === question.answer
                ? 'correct'
                : option === selectedAnswer
                  ? 'wrong'
                  : 'idle'

          return (
            <OptionButton
              disabled={selectedAnswer !== null}
              key={option}
              onClick={() => onAnswer(option)}
              option={option}
              state={state}
            />
          )
        })}
      </div>
    </section>
  )
}
