import type { Question } from '../../utils/quizUtils'
import OptionButton from './OptionButton'
import Timer from './Timer'

type QuestionCardProps = {
  question: Question
  currentIndex: number
  total: number
  seconds: number
  selectedAnswer: string | null
  onAnswer: (answer: string) => void
}

export default function QuestionCard({
  question,
  currentIndex,
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
