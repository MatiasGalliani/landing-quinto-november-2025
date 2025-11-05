import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NumberInput } from "./NumberInput";
import { NavigationButtons } from "./NavigationButtons";
import { SelectInput } from "./SelectInput";
import {
  PensionatoData,
  ENTI_PENSIONISTICI,
  TIPOLOGIE_PENSIONE,
  NON_FINANCEABLE_PENSION_TYPES,
} from "@/types/form.types";

interface PensionatoFlowProps {
  data: PensionatoData;
  onUpdate: (data: PensionatoData) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function PensionatoFlow({ data, onUpdate, onBack, onSubmit }: PensionatoFlowProps) {
  const updateField = (field: Partial<PensionatoData>) => {
    onUpdate({ ...data, ...field });
  };

  const clearError = () => updateField({ error: "" });

  const handleAmountNext = () => {
    if (!data.amount || data.amount <= 0) {
      updateField({ error: "Inserisci un importo valido" });
      return;
    }
    clearError();
    updateField({ step: 2 });
  };

  const handlePensionNext = () => {
    if (!data.pension || data.pension < 660) {
      updateField({
        error: "Non è possibile procedere perché l'importo della pensione è al di sotto del minimo richiesto",
      });
      return;
    }
    clearError();
    updateField({ step: 3 });
  };

  const handleEnteNext = () => {
    if (!data.ente) {
      updateField({ error: "Seleziona un ente pensionistico" });
      return;
    }
    if (data.ente === "PENSIONATO ITALIANO RESIDENTE ESTERO") {
      updateField({ step: 5, error: "" });
      return;
    }
    clearError();
    updateField({ step: 4 });
  };

  const handleTipoNext = () => {
    if (!data.tipo) {
      updateField({ error: "Seleziona una tipologia di pensione" });
      return;
    }
    if (NON_FINANCEABLE_PENSION_TYPES.includes(data.tipo as any)) {
      updateField({
        error: "Spiacente, non possiamo finanziare questa tipologia di pensione",
      });
      return;
    }
    clearError();
    updateField({ step: 5 });
  };

  const handleStepBack = () => {
    if (data.step > 1) {
      updateField({ step: data.step - 1, error: "" });
    } else {
      onBack();
    }
  };

  return (
    <>
      {data.step === 1 && (
        <div className="space-y-4">
          <NumberInput
            value={data.amount}
            onChange={(amount) => updateField({ amount })}
            label="Di quanto hai bisogno?"
            subtitle="Importo richiesto"
            placeholder="Es. 25000"
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleAmountNext} />
        </div>
      )}

      {data.step === 2 && (
        <div className="space-y-4">
          <NumberInput
            value={data.pension}
            onChange={(pension) => updateField({ pension })}
            label="Qual è la tua pensione netta mensile?"
            subtitle="Pensione mensile netta"
            placeholder="Es. 1200"
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handlePensionNext} />
        </div>
      )}

      {data.step === 3 && (
        <div className="space-y-4">
          <SelectInput
            label="Ente pensionistico"
            value={data.ente}
            onChange={(ente) => updateField({ ente })}
            options={ENTI_PENSIONISTICI}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleEnteNext} />
        </div>
      )}

      {data.step === 4 && (
        <div className="space-y-4">
          <SelectInput
            label="Tipologia pensione"
            value={data.tipo}
            onChange={(tipo) => updateField({ tipo })}
            options={TIPOLOGIE_PENSIONE}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleTipoNext} />
        </div>
      )}

      {data.step === 5 && (
        <div className="space-y-4">
          <div className="text-center py-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              Tutti i dati sono stati inseriti. Clicca su "Invia richiesta" per completare.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleStepBack} variant="outline" className="flex-1 h-12">
              Indietro
            </Button>
            <Button
              onClick={onSubmit}
              className="flex-1 h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Invia richiesta
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

