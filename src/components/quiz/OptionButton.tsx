type OptionButtonProps = {
  option: string
  disabled: boolean
  state: 'idle' | 'correct' | 'wrong'
  onClick: () => void
}

const stateClasses = {
  idle: 'border-slate-300 bg-white text-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800',
  correct: 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-100',
  wrong: 'border-rose-500 bg-rose-100 text-rose-900 dark:border-rose-400 dark:bg-rose-500/20 dark:text-rose-100',
}

export default function OptionButton({ option, disabled, state, onClick }: OptionButtonProps) {
  return (
    <button
      className={`min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${stateClasses[state]}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {option}
    </button>
  )
}
