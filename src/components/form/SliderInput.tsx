interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  subtitle?: string;
  formatValue?: (value: number) => string;
}

export function SliderInput({
  value,
  onChange,
  min,
  max,
  step,
  label,
  subtitle,
  formatValue = (val) => `${val.toLocaleString('it-IT')} €`,
}: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
        <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 mb-2">
          {formatValue(value)}
        </div>
        <div className="text-sm text-slate-600 font-medium">
          {subtitle || label}
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${percentage}%, rgb(226, 232, 240) ${percentage}%, rgb(226, 232, 240) 100%)`,
          }}
        />
        
        <div className="flex justify-between text-sm text-slate-500 font-medium">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
}

