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

  // Step 1: Contact Info
  const handleContactNext = () => {
    clearError();
    updateField({ step: 2 });
    // Scroll to top of form section
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 2: Tipología de pensión
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
    updateField({ step: 3 });
  };

  // Step 3: Ente pensionístico (Final)
  const handleEnteNext = () => {
    if (!data.ente) {
      updateField({ error: "Seleziona un ente pensionistico" });
      return;
    }
    clearError();
    onSubmit();
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
      {/* Step 1: Información de contacto */}
      {data.step === 1 && (
        <div className="space-y-4">
          <ContactInfoFields />
          <div className="text-center py-3 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">
              Solo alcuni passaggi finali per completare la tua richiesta
            </p>
          </div>
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleContactNext} />
        </div>
      )}

      {/* Step 2: Tipología de pensión */}
      {data.step === 2 && (
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

      {/* Step 3: Ente pensionístico (Final) */}
      {data.step === 3 && (
        <div className="space-y-4">
          <SelectInput
            label="Ente pensionistico"
            value={data.ente}
            onChange={(ente) => updateField({ ente })}
            options={ENTI_PENSIONISTICI}
          />
          <div className="text-center py-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              Tutti i dati sono stati inseriti. Clicca su "Invia richiesta" per completare.
            </p>
          </div>
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          
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
              onClick={handleEnteNext}
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


