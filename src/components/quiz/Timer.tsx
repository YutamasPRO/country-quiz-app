type TimerProps = {
  seconds: number
}

export default function Timer({ seconds }: TimerProps) {
  const urgent = seconds <= 5

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
        <span>Contrarreloj</span>
        <span aria-label="tiempo restante">{seconds}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${urgent ? 'bg-rose-500' : 'bg-cyan-500'}`}
          style={{ width: `${(seconds / 15) * 100}%` }}
        />
      </div>
    </div>
  )
}
