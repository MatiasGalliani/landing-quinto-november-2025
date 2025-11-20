"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "@/hooks/useFormState";
import { ProgressBar } from "./form/ProgressBar";
import { PensionatoFlow } from "./form/PensionatoFlow";
import { DipendenteFlow } from "./form/DipendenteFlow";
import type { UserPosition } from "@/types/form.types";

const formSchema = z.object({
  nome: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  cognome: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  mail: z.string().email("Inserisci un indirizzo email valido"),
  telefono: z.string().min(10, "Il numero di telefono deve contenere almeno 10 cifre"),
  meseNascita: z.string().min(1, "Seleziona il mese di nascita"),
  annoNascita: z.string().min(4, "Inserisci l'anno di nascita").regex(/^\d{4}$/, "L'anno deve essere di 4 cifre"),
});

export function FormSection() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initialStep, setInitialStep] = useState(1);
  const [tempAmount, setTempAmount] = useState(25000);
  const [tempIncome, setTempIncome] = useState(1500);
  const [tempError, setTempError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Ensure client-side only rendering for slider styles
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      mail: "",
      telefono: "",
      meseNascita: "",
      annoNascita: "",
    },
  });

  const {
    showPersonalInfo,
    setShowPersonalInfo,
    userPosition,
    setUserPosition,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    pensionato,
    setPensionato,
    dipendente,
    setDipendente,
    getCurrentStep,
    getTotalSteps,
    calculateProgress,
    resetForm,
  } = useFormState(form);

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    if (!userPosition) {
      console.error('User position not selected');
      setSubmitError('Seleziona la tua posizione prima di inviare il form.');
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      // Create JSON payload based on user position
      let payload: any;
      let endpoint: string;

      if (userPosition === "DIPENDENTE") {
        // Combine personal info with dipendente data
        payload = {
          // Personal information
          nome: values.nome,
          cognome: values.cognome,
          mail: values.mail,
          telefono: values.telefono,
          meseNascita: values.meseNascita,
          annoNascita: values.annoNascita,
          // Dipendente specific data
          amount: dipendente.amount,
          salary: dipendente.salary,
          tipo: dipendente.tipo,
          contratto: dipendente.contratto,
          numDipendenti: dipendente.numDipendenti || null,
          dataAssunzione: dipendente.dataAssunzione || null,
          tfr: dipendente.tfr || null,
          // Metadata
          userPosition: "DIPENDENTE",
          submittedAt: new Date().toISOString(),
        };
        endpoint = '/api/forms/quinto-dipendenti';
      } else if (userPosition === "PENSIONATO") {
        // Combine personal info with pensionato data
        payload = {
          // Personal information
          nome: values.nome,
          cognome: values.cognome,
          mail: values.mail,
          telefono: values.telefono,
          meseNascita: values.meseNascita,
          annoNascita: values.annoNascita,
          // Pensionato specific data
          amount: pensionato.amount,
          pension: pensionato.pension,
          tipo: pensionato.tipo,
          ente: pensionato.ente,
          // Metadata
          userPosition: "PENSIONATO",
          submittedAt: new Date().toISOString(),
        };
        endpoint = '/api/forms/quinto-pensionati';
      } else {
        throw new Error('Invalid user position');
      }

      // Send JSON to appropriate endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Errore sconosciuto' }));
        throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      
      setIsLoading(false);
      setIsSubmitted(true);
      // Redirect to thank-you page
      router.push("/grazie");
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore durante l\'invio del form. Riprova più tardi.';
      setSubmitError(errorMessage);
    }
  }, [setIsLoading, setIsSubmitted, userPosition, dipendente, pensionato]);

  const handlePositionSelect = useCallback((position: UserPosition) => {
    setUserPosition(position);
    if (position === "PENSIONATO") {
      setPensionato({ 
        ...pensionato, 
        step: 1,  // Start at step 1 in the flow
        amount: tempAmount, 
        pension: tempIncome, 
        error: "" 
      });
    } else {
      setDipendente({ 
        ...dipendente, 
        step: 1,  // Start at step 1 in the flow
        amount: tempAmount, 
        salary: tempIncome, 
        error: "" 
      });
    }
    setSubmitError(null);
  }, [setUserPosition, setPensionato, setDipendente, pensionato, dipendente, tempAmount, tempIncome]);

  const handleBack = useCallback(() => {
    if (userPosition) {
      if (userPosition === "PENSIONATO" && pensionato.step === 4) {
        setUserPosition(null);
        setInitialStep(3);
      } else if (userPosition === "DIPENDENTE" && dipendente.step === 4) {
        setUserPosition(null);
        setInitialStep(3);
      } else {
        setUserPosition(null);
        setShowPersonalInfo(false);
      }
    } else if (initialStep > 1) {
      setInitialStep(initialStep - 1);
      setTempError("");
    }
  }, [userPosition, setUserPosition, setShowPersonalInfo, initialStep, pensionato.step, dipendente.step]);

  const getHeaderContent = () => {
    if (isLoading || isSubmitted) return null;
    
    if (!userPosition) {
      // Initial steps before position selection
      const initialTitles = [
        "Calcola la Tua Rata Ora",
        "Qual è il tuo reddito mensile?",
        "Sei Pensionato o Dipendente?",
      ];
      const initialSubtitles = [
        "Calcola il tuo preventivo in 30 secondi. Zero impegno, 100% online.",
        "Questo ci aiuta a determinare l'importo massimo finanziabile",
        "Conferma la tua posizione per continuare con la richiesta",
      ];
      return {
        badge: initialStep === 1 ? { text: "Calcolo immediato, zero impegno", color: "blue" } : undefined,
        title: initialTitles[initialStep - 1],
        subtitle: initialSubtitles[initialStep - 1],
      };
    }

    if (userPosition === "PENSIONATO") {
      // Steps after position selection: 1=Contact, 2=Type, 3=Entity
      const titles = [
        "Quasi fatto! I tuoi dati di contatto",
        "Tipologia di pensione",
        "Ente pensionistico",
      ];
      const subtitles = [
        "Per inviarti il preventivo personalizzato",
        "Alcune tipologie hanno condizioni speciali più vantaggiose",
        "Per velocizzare la pratica con il tuo ente",
      ];
      return {
        title: titles[pensionato.step - 1],
        subtitle: subtitles[pensionato.step - 1],
      };
    }

    if (userPosition === "DIPENDENTE") {
      // Steps after position selection: 1=Contact, 2=Type, 3=Contract, 4=NumEmployees, 5=DateHired, 6=TFR
      const titles = [
        "Quasi fatto! I tuoi dati di contatto",
        "Tipo di dipendente",
        "Tipo di contratto",
        "Dimensione dell'azienda",
        "Quando sei stato assunto?",
        "Domanda sul TFR",
      ];
      const subtitles = [
        "Per inviarti il preventivo personalizzato",
        "Il settore pubblico e privato hanno condizioni diverse",
        "Richiesto per valutare l'idoneità della pratica",
        "Aziende più grandi offrono maggiori garanzie",
        "Per calcolare l'anzianità lavorativa",
        "Il TFR può essere usato come garanzia aggiuntiva",
      ];
      return {
        title: titles[dipendente.step - 1],
        subtitle: subtitles[dipendente.step - 1],
      };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="relative" id="form-section">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-10"></div>
      <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"></div>
        
        <CardHeader className="space-y-3 pb-6">
          {/* Progress Bar */}
          {!isLoading && !isSubmitted && (
            <ProgressBar
              currentStep={userPosition ? getCurrentStep() : initialStep}
              totalSteps={userPosition ? getTotalSteps() : 3}
              progress={userPosition ? calculateProgress() : Math.round((initialStep / 3) * 100)}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Caricamento...</CardTitle>
              <p className="text-slate-600">Stiamo elaborando la tua richiesta</p>
            </div>
          )}

          {/* Success State */}
          {isSubmitted && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Richiesta inviata con successo!</CardTitle>
              <p className="text-slate-600 mt-2">Un nostro consulente ti contatterà entro <span className="font-bold text-blue-600">2 ore</span></p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-slate-600">Controlla la tua email per la conferma</p>
              </div>
            </div>
          )}

          {/* Dynamic Header Content */}
          {headerContent && (
            <div className="text-center">
              {headerContent.badge && (
                <div className={`inline-flex items-center gap-2 text-sm font-medium ${
                  headerContent.badge.color === 'blue' ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50'
                } px-3 py-1 rounded-full w-fit mx-auto`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {headerContent.badge.text}
                </div>
              )}
              <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                {headerContent.title}
              </CardTitle>
              <p className="text-sm lg:text-base text-slate-600">
                {headerContent.subtitle}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0 space-y-6">
          {/* Error Message */}
          {submitError && !isLoading && !isSubmitted && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Errore nell'invio</p>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                  aria-label="Chiudi errore"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Initial Flow - Steps 1-3 (before position selection) */}
          {!userPosition && (
            <>
              {/* Step 1: Amount */}
              {initialStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Importo richiesto
                    </label>
                    <input
                      type="range"
                      min="2000"
                      max="75000"
                      step="500"
                      value={tempAmount}
                      onChange={(e) => setTempAmount(parseInt(e.target.value))}
                      className="w-full slider"
                      style={isMounted ? {
                        // @ts-ignore
                        '--slider-progress': `${((tempAmount - 2000) / (75000 - 2000)) * 100}%`,
                        background: `linear-gradient(to right, 
                          rgb(59, 130, 246) 0%, 
                          rgb(99, 102, 241) ${((tempAmount - 2000) / (75000 - 2000)) * 100}%, 
                          rgb(219, 234, 254) ${((tempAmount - 2000) / (75000 - 2000)) * 100}%, 
                          rgb(219, 234, 254) 100%
                        )`
                      } : undefined}
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>€2.000</span>
                      <span className="text-2xl font-bold text-blue-600">€{tempAmount.toLocaleString('it-IT')}</span>
                      <span>€75.000</span>
                    </div>
                  </div>
                  {tempError && <p className="text-sm text-red-600">{tempError}</p>}
                  <Button
                    onClick={() => {
                      if (!tempAmount || tempAmount <= 0) {
                        setTempError("Inserisci un importo valido");
                        return;
                      }
                      setTempError("");
                      setInitialStep(2);
                    }}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                  >
                    Continua
                  </Button>
                </div>
              )}

              {/* Step 2: Income */}
              {initialStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stipendio / Pensione mensile netta
                    </label>
                    <input
                      type="range"
                      min="700"
                      max="7000"
                      step="50"
                      value={tempIncome}
                      onChange={(e) => setTempIncome(parseInt(e.target.value))}
                      className="w-full slider"
                      style={isMounted ? {
                        // @ts-ignore
                        '--slider-progress': `${((tempIncome - 700) / (7000 - 700)) * 100}%`,
                        background: `linear-gradient(to right, 
                          rgb(59, 130, 246) 0%, 
                          rgb(99, 102, 241) ${((tempIncome - 700) / (7000 - 700)) * 100}%, 
                          rgb(219, 234, 254) ${((tempIncome - 700) / (7000 - 700)) * 100}%, 
                          rgb(219, 234, 254) 100%
                        )`
                      } : undefined}
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>€700</span>
                      <span className="text-2xl font-bold text-blue-600">€{tempIncome.toLocaleString('it-IT')}</span>
                      <span>€7.000</span>
                    </div>
                  </div>
                  {tempError && <p className="text-sm text-red-600">{tempError}</p>}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setInitialStep(1);
                        setTempError("");
                      }}
                      variant="outline"
                      className="flex-1 h-12"
                    >
                      Indietro
                    </Button>
                    <Button
                      onClick={() => {
                        if (!tempIncome || tempIncome < 660) {
                          setTempError("L'importo è al di sotto del minimo richiesto");
                          return;
                        }
                        setTempError("");
                        setInitialStep(3);
                      }}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                    >
                      Continua
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Position Selection */}
              {initialStep === 3 && (
                <div className="space-y-3">
                  <Button
                    onClick={() => handlePositionSelect("PENSIONATO")}
                    className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>PENSIONATO</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Button>
                  <Button
                    onClick={() => handlePositionSelect("DIPENDENTE")}
                    className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>DIPENDENTE</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Button>
                  <Button
                    onClick={() => {
                      setInitialStep(2);
                      setTempError("");
                    }}
                    variant="outline"
                    className="w-full h-12"
                  >
                    Indietro
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Pensionato Flow */}
          {userPosition === "PENSIONATO" && (
            <Form {...form}>
              <PensionatoFlow
                data={pensionato}
                onUpdate={setPensionato}
                onBack={handleBack}
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </Form>
          )}

          {/* Dipendente Flow */}
          {userPosition === "DIPENDENTE" && (
            <Form {...form}>
              <DipendenteFlow
                data={dipendente}
                onUpdate={setDipendente}
                onBack={handleBack}
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
