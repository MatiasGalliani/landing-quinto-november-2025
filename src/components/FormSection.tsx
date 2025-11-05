"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
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
});

export function FormSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      mail: "",
      telefono: "",
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

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      localStorage.removeItem('creditplan_form_data');
    }, 2500);
  }, [setIsLoading, setIsSubmitted]);

  const handlePositionSelect = useCallback((position: UserPosition) => {
    setUserPosition(position);
    setPensionato({ ...pensionato, step: 1, error: "" });
    setDipendente({ ...dipendente, step: 1, error: "" });
  }, [setUserPosition, setPensionato, setDipendente, pensionato, dipendente]);

  const handleBack = useCallback(() => {
    if (userPosition) {
      setUserPosition(null);
      setShowPersonalInfo(true);
    }
  }, [userPosition, setUserPosition, setShowPersonalInfo]);

  const getHeaderContent = () => {
    if (isLoading || isSubmitted) return null;
    
    if (showPersonalInfo) {
      return {
        badge: { text: "Risposta rapida garantita", color: "blue" },
        title: "Inizia la tua richiesta",
        subtitle: (
          <>
            Inserisci i tuoi dati di contatto. Riceverai una risposta personalizzata in{" "}
            <span className="font-bold text-blue-600">meno di 2 ore</span>
          </>
        ),
      };
    }
    
    if (!userPosition) {
      return {
        badge: { text: "Dati salvati ✓", color: "green" },
        title: "Qual è la tua posizione?",
        subtitle: (
          <>
            Seleziona la tua situazione per trovare{" "}
            <span className="font-semibold text-slate-900">le condizioni più vantaggiose</span>
          </>
        ),
      };
    }

    if (userPosition === "PENSIONATO") {
      const titles = [
        "Di quanto hai bisogno?",
        "Qual è la tua pensione mensile?",
        "Ente pensionistico",
        "Tipologia di pensione",
        "Quasi fatto!",
      ];
      const subtitles = [
        "Questo ci aiuta a calcolare la rata mensile ottimale per te",
        "Necessario per determinare l'importo massimo finanziabile",
        "Per velocizzare la pratica con il tuo ente",
        "Alcune tipologie hanno condizioni speciali più vantaggiose",
        "Clicca per inviare la richiesta e ricevere la tua offerta personalizzata",
      ];
      return {
        title: titles[pensionato.step - 1],
        subtitle: subtitles[pensionato.step - 1],
      };
    }

    if (userPosition === "DIPENDENTE") {
      const titles = [
        "Di quanto hai bisogno?",
        "Qual è il tuo stipendio netto?",
        "Tipo di dipendente",
        "Tipo di contratto",
        "Dimensione dell'azienda",
        "Quando sei stato assunto?",
        "Domanda sul TFR",
        "Quasi fatto!",
      ];
      const subtitles = [
        "Questo ci aiuta a calcolare la rata mensile ottimale per te",
        "Necessario per determinare l'importo massimo finanziabile",
        "Il settore pubblico e privato hanno condizioni diverse",
        "Richiesto per valutare l'idoneità della pratica",
        "Aziende più grandi offrono maggiori garanzie",
        "Per calcolare l'anzianità lavorativa",
        "Il TFR può essere usato come garanzia aggiuntiva",
        "Clicca per inviare la richiesta e ricevere la tua offerta personalizzata",
      ];
      return {
        title: titles[dipendente.step - 1],
        subtitle: subtitles[dipendente.step - 1],
      };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-10"></div>
      <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"></div>
        
        <CardHeader className="space-y-3 pb-6">
          {/* Progress Bar */}
          {!isLoading && !isSubmitted && !showPersonalInfo && userPosition && (
            <ProgressBar
              currentStep={getCurrentStep()}
              totalSteps={getTotalSteps()}
              progress={calculateProgress()}
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
          {/* Personal Info Form */}
          {showPersonalInfo && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => setShowPersonalInfo(false))} className="space-y-5">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Nome</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Mario" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cognome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Cognome</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Rossi" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="mario.rossi@esempio.it" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Telefono</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="+39 333 123 4567" 
                          {...field}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Continua
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                
                {/* Trust indicators */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dati protetti e criptati • Nessuna condivisione con terzi</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>Tempo medio: 90 sec</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>2.147 richieste questo mese</span>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          )}

          {/* Position Selection */}
          {!showPersonalInfo && !userPosition && (
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
            </div>
          )}

          {/* Pensionato Flow */}
          {userPosition === "PENSIONATO" && (
            <PensionatoFlow
              data={pensionato}
              onUpdate={setPensionato}
              onBack={handleBack}
              onSubmit={form.handleSubmit(onSubmit)}
            />
          )}

          {/* Dipendente Flow */}
          {userPosition === "DIPENDENTE" && (
            <DipendenteFlow
              data={dipendente}
              onUpdate={setDipendente}
              onBack={handleBack}
              onSubmit={form.handleSubmit(onSubmit)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
