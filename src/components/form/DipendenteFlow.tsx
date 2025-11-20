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

  // Step 1: Contact Info
  const handleContactNext = () => {
    clearError();
    updateField({ step: 2 });
  };

  // Step 2: Tipo dipendente
  const handleTipoNext = () => {
    if (!data.tipo) {
      updateField({ error: "Seleziona una tipologia di dipendente" });
      return;
    }
    clearError();
    updateField({ step: 3 });
  };

  // Step 3: Tipo contratto
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
    
    // If PUBBLICO/STATALE, skip num dipendenti and go directly to data assunzione
    if (data.tipo === "PUBBLICO/STATALE") {
      updateField({ step: 5 });
    } else {
      updateField({ step: 4 });
    }
  };

  // Step 4: Num dipendenti (solo non-PUBBLICO)
  const handleNumDipendentiNext = () => {
    const num = parseInt(data.numDipendenti);
    if (!data.numDipendenti || num < 11) {
      updateField({ error: "Non è possibile procedere" });
      return;
    }
    clearError();
    updateField({ step: 5 });
  };

  // Step 5: Data assunzione
  const handleDataAssunzioneNext = () => {
    if (!data.dataAssunzione) {
      updateField({ error: "Inserisci la data di assunzione" });
      return;
    }
    
    // If PUBBLICO/STATALE, skip TFR question and submit
    if (data.tipo === "PUBBLICO/STATALE") {
      clearError();
      onSubmit();
      return;
    }
    
    const assunzioneDate = new Date(data.dataAssunzione);
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    if (assunzioneDate > sixMonthsAgo) {
      clearError();
      onSubmit();
      return;
    }
    clearError();
    updateField({ step: 6 });
  };

  // Step 6: TFR (solo non-PUBBLICO con >6 meses)
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

      {/* Step 2: Tipo di dipendente */}
      {data.step === 2 && (
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

      {/* Step 3: Tipo di contratto */}
      {data.step === 3 && (
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

      {/* Step 4: Numero dipendenti (solo para non-pubblico) */}
      {data.step === 4 && data.tipo !== "PUBBLICO/STATALE" && (
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

      {/* Step 5: Data di assunzione */}
      {(data.step === 5 && data.tipo === "PUBBLICO/STATALE") || (data.step === 5 && data.tipo !== "PUBBLICO/STATALE") ? (
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
          <div className="text-center py-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              {data.tipo === "PUBBLICO/STATALE" 
                ? "Tutti i dati sono stati inseriti. Clicca per completare."
                : "Quasi fatto! Ultimo passaggio per completare la tua richiesta."}
            </p>
          </div>
          {data.error && <p className="text-sm text-red-600">{data.error}</p>}
          
          {/* Privacy Acceptance - Solo per PUBBLICO/STATALE */}
          {data.tipo === "PUBBLICO/STATALE" && (
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="privacy-dipendente-pubblico"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="privacy-dipendente-pubblico" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
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
          )}

          {data.tipo === "PUBBLICO/STATALE" ? (
            <div className="flex gap-3">
              <Button onClick={handleStepBack} variant="outline" className="flex-1 h-12">
                Indietro
              </Button>
              <Button
                onClick={handleDataAssunzioneNext}
                disabled={!privacyAccepted}
                className="flex-1 h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Invia richiesta
              </Button>
            </div>
          ) : (
            <NavigationButtons onBack={handleStepBack} onNext={handleDataAssunzioneNext} />
          )}
        </div>
      ) : null}

      {/* Step 6: TFR (solo para non-pubblico con più di 6 mesi) */}
      {data.step === 6 && data.tipo !== "PUBBLICO/STATALE" && (
        <div className="space-y-4">
          <SelectInput
            label="Versi il TFR ad un fondo pensione?"
            value={data.tfr}
            onChange={(tfr) => updateField({ tfr })}
            options={["SI", "NO"]}
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
              onClick={handleTFRNext}
              disabled={!privacyAccepted}
              className="flex-1 h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Invia richiesta
            </Button>
          </div>
        </div>
      )}

      {/* OLD FINAL STEP - REMOVED */}
      {((data.step === 999 && data.tipo === "PUBBLICO/STATALE") || (data.step === 999 && data.tipo !== "PUBBLICO/STATALE")) && (
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

