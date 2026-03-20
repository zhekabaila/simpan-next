export function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 === current
                ? 'bg-blue-600 text-white'
                : i + 1 < current
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 text-slate-400'
            }`}>
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && <div className={`h-0.5 w-8 ${i + 1 < current ? 'bg-green-500' : 'bg-slate-100'}`} />}
        </div>
      ))}
      <span className="ml-2 text-sm text-slate-500">
        Langkah {current} dari {total}
      </span>
    </div>
  )
}
