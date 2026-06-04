type TimerProps = {
  seconds: number
}

export default function Timer({ seconds }: TimerProps) {
  const urgent = seconds <= 5

  return (
    <div className="w-full rounded-2xl bg-slate-100/90 p-4 dark:bg-slate-900/90">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
        <span>Contrarreloj</span>
        <span
          aria-label="tiempo restante"
          className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.25em] ${
            urgent
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200'
              : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200'
          }`}
        >
          {seconds}s
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${urgent ? 'bg-rose-500' : 'bg-cyan-500'}`}
          style={{ width: `${(seconds / 15) * 100}%` }}
        />
      </div>
    </div>
  )
}
