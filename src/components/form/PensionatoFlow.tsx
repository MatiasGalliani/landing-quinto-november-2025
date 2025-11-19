import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NumberInput } from "./NumberInput";
import { NavigationButtons } from "./NavigationButtons";
import { SelectInput } from "./SelectInput";
import { SliderInput } from "./SliderInput";
import { ContactInfoFields } from "./ContactInfoFields";
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

const PRIVACY_POLICY_URL = "https://creditplan.it/wp-content/uploads/2023/04/Informativa-privacy.pdf";

export function PensionatoFlow({ data, onUpdate, onBack, onSubmit }: PensionatoFlowProps) {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

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
    updateField({ step: 4 });
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
          <SliderInput
            value={data.amount || 20000}
            onChange={(amount) => updateField({ amount })}
            label="Di quanto hai bisogno?"
            subtitle="Importo richiesto"
            min={2000}
            max={80000}
            step={500}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleAmountNext} />
        </div>
      )}

      {data.step === 2 && (
        <div className="space-y-4">
          <SliderInput
            value={data.pension || 1200}
            onChange={(pension) => updateField({ pension })}
            label="Qual è la tua pensione netta mensile?"
            subtitle="Pensione mensile netta"
            min={700}
            max={5000}
            step={50}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handlePensionNext} />
        </div>
      )}

      {data.step === 3 && (
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

      {data.step === 4 && (
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

      {data.step === 5 && (
        <div className="space-y-4">
          <ContactInfoFields />
          <div className="text-center py-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              Tutti i dati sono stati inseriti. Clicca su "Invia richiesta" per completare.
            </p>
          </div>
          
          {/* Privacy Acceptance */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="privacy-pensionato"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="privacy-pensionato" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
              Accetto il trattamento dei dati personali secondo il{" "}
              <a
                href={PRIVACY_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Regolamento Generale sulla Protezione dei Dati (GDPR)
              </a>
              {" "}e la{" "}
              <a
                href={PRIVACY_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy di Creditplan
              </a>
              {" "}ai sensi del Regolamento UE 2016/679.
            </label>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleStepBack} variant="outline" className="flex-1 h-12">
              Indietro
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!privacyAccepted}
              className="flex-1 h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Invia richiesta
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

