import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumberInput } from "./NumberInput";
import { NavigationButtons } from "./NavigationButtons";
import { SelectInput } from "./SelectInput";
import { SliderInput } from "./SliderInput";
import { ContactInfoFields } from "./ContactInfoFields";
import {
  DipendenteData,
  TIPOLOGIE_DIPENDENTE,
  TIPOLOGIE_CONTRATTO,
} from "@/types/form.types";

interface DipendenteFlowProps {
  data: DipendenteData;
  onUpdate: (data: DipendenteData) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const PRIVACY_POLICY_URL = "https://creditplan.it/wp-content/uploads/2023/04/Informativa-privacy.pdf";

export function DipendenteFlow({ data, onUpdate, onBack, onSubmit }: DipendenteFlowProps) {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const updateField = (field: Partial<DipendenteData>) => {
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

  const handleSalaryNext = () => {
    if (!data.salary || data.salary < 660) {
      updateField({
        error: "Non è possibile procedere perché l'importo dello stipendio è al di sotto del minimo richiesto",
      });
      return;
    }
    clearError();
    updateField({ step: 3 });
  };

  const handleTipoNext = () => {
    if (!data.tipo) {
      updateField({ error: "Seleziona una tipologia di dipendente" });
      return;
    }
    clearError();
    updateField({ step: 4 });
  };

  const handleContrattoNext = () => {
    if (!data.contratto) {
      updateField({ error: "Seleziona una tipologia di contratto" });
      return;
    }
    if (data.contratto === "DETERMINATO") {
      updateField({ error: "Non è possibile procedere con contratto a tempo determinato" });
      return;
    }
    clearError();
    
    // If PUBBLICO/STATALE, skip num dipendenti and go directly to data assunzione (step 5)
    // For others, go to num dipendenti (step 5)
    if (data.tipo === "PUBBLICO/STATALE") {
      // Skip to data assunzione - but we need to use a different step number
      // Let's use step 5 for data assunzione when PUBBLICO/STATALE
      updateField({ step: 5 });
    } else {
      updateField({ step: 5 });
    }
  };

  const handleNumDipendentiNext = () => {
    const num = parseInt(data.numDipendenti);
    if (!data.numDipendenti || num < 11) {
      updateField({ error: "Non è possibile procedere" });
      return;
    }
    clearError();
    updateField({ step: 6 });
  };

  const handleDataAssunzioneNext = () => {
    if (!data.dataAssunzione) {
      updateField({ error: "Inserisci la data di assunzione" });
      return;
    }
    
    // If PUBBLICO/STATALE, skip TFR question and go directly to final step
    if (data.tipo === "PUBBLICO/STATALE") {
      clearError();
      updateField({ step: 7 });
      return;
    }
    
    const assunzioneDate = new Date(data.dataAssunzione);
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    if (assunzioneDate > sixMonthsAgo) {
      clearError();
      updateField({ step: 7 });
      return;
    }
    clearError();
    updateField({ step: 8 });
  };

  const handleTFRNext = () => {
    if (!data.tfr) {
      updateField({ error: "Rispondi alla domanda sul TFR" });
      return;
    }
    if (data.tfr === "NO") {
      updateField({ error: "Non è possibile procedere" });
      return;
    }
    clearError();
    updateField({ step: 8 });
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
            value={data.amount || 30000}
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
            value={data.salary || 1800}
            onChange={(salary) => updateField({ salary })}
            label="Qual è il tuo stipendio netto mensile?"
            subtitle="Stipendio netto mensile"
            min={700}
            max={7000}
            step={50}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleSalaryNext} />
        </div>
      )}

      {data.step === 3 && (
        <div className="space-y-4">
          <SelectInput
            label="Tipologia dipendente"
            value={data.tipo}
            onChange={(tipo) => updateField({ tipo })}
            options={TIPOLOGIE_DIPENDENTE}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleTipoNext} />
        </div>
      )}

      {data.step === 4 && (
        <div className="space-y-4">
          <SelectInput
            label="Tipologia contratto"
            value={data.contratto}
            onChange={(contratto) => updateField({ contratto })}
            options={TIPOLOGIE_CONTRATTO}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleContrattoNext} />
        </div>
      )}

      {data.step === 5 && data.tipo !== "PUBBLICO/STATALE" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Numero di dipendenti dell'azienda
            </label>
            <Input
              type="number"
              value={data.numDipendenti}
              onChange={(e) => updateField({ numDipendenti: e.target.value })}
              placeholder="Es. 50"
              className="h-12"
            />
          </div>
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleNumDipendentiNext} />
        </div>
      )}

      {(data.step === 5 && data.tipo === "PUBBLICO/STATALE") || (data.step === 6 && data.tipo !== "PUBBLICO/STATALE") ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data di assunzione
            </label>
            <Input
              type="date"
              value={data.dataAssunzione}
              onChange={(e) => updateField({ dataAssunzione: e.target.value })}
              className="h-12"
              lang="it"
            />
            <p className="text-xs text-slate-500 mt-1">Formato: GG/MM/AAAA</p>
          </div>
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleDataAssunzioneNext} />
        </div>
      ) : null}

      {data.step === 7 && data.tipo !== "PUBBLICO/STATALE" && (
        <div className="space-y-4">
          <SelectInput
            label="Versi il TFR ad un fondo pensione?"
            value={data.tfr}
            onChange={(tfr) => updateField({ tfr })}
            options={["SI", "NO"]}
          />
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          <NavigationButtons onBack={handleStepBack} onNext={handleTFRNext} />
        </div>
      )}

      {((data.step === 7 && data.tipo === "PUBBLICO/STATALE") || (data.step === 8 && data.tipo !== "PUBBLICO/STATALE")) && (
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
              id="privacy-dipendente"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="privacy-dipendente" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
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

