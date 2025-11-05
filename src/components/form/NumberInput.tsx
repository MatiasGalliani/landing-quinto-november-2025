import { Input } from "@/components/ui/input";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  subtitle?: string;
  placeholder?: string;
  formatValue?: (value: number) => string;
}

export function NumberInput({
  value,
  onChange,
  label,
  subtitle,
  placeholder = "Inserisci l'importo",
  formatValue = (val) => val > 0 ? `${val.toLocaleString('it-IT')} €` : "0 €",
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    onChange(val ? parseInt(val, 10) : 0);
  };

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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
        <Input
          type="text"
          inputMode="numeric"
          value={value > 0 ? value : ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="h-14 text-lg text-center font-semibold border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <p className="text-xs text-slate-500 mt-2 text-center">
          Inserisci l'importo esatto in euro
        </p>
      </div>
    </div>
  );
}

