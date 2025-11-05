interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function ProgressBar({ currentStep, totalSteps, progress }: ProgressBarProps) {
  return (
    <div className="space-y-2.5 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Passo {currentStep} di {totalSteps}
          </span>
          <div className="h-1 w-1 rounded-full bg-slate-300"></div>
          <span className="text-sm font-bold text-blue-600">{progress}% completato</span>
        </div>
      </div>
      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-700 ease-out rounded-full shadow-sm"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-0.5">
        <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>I tuoi dati sono salvati e protetti</span>
      </div>
    </div>
  );
}

