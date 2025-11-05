import { useState, useEffect, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  UserPosition,
  PensionatoData,
  DipendenteData,
  INITIAL_PENSIONATO_STATE,
  INITIAL_DIPENDENTE_STATE,
} from "@/types/form.types";

interface UseFormStateReturn {
  showPersonalInfo: boolean;
  setShowPersonalInfo: (show: boolean) => void;
  userPosition: UserPosition;
  setUserPosition: (position: UserPosition) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  contactInfoSubmitted: boolean;
  setContactInfoSubmitted: (submitted: boolean) => void;
  pensionato: PensionatoData;
  setPensionato: (data: PensionatoData | ((prev: PensionatoData) => PensionatoData)) => void;
  dipendente: DipendenteData;
  setDipendente: (data: DipendenteData | ((prev: DipendenteData) => DipendenteData)) => void;
  getCurrentStep: () => number;
  getTotalSteps: () => number;
  calculateProgress: () => number;
  resetForm: () => void;
}

export function useFormState(form: UseFormReturn<any>): UseFormStateReturn {
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [userPosition, setUserPosition] = useState<UserPosition>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactInfoSubmitted, setContactInfoSubmitted] = useState(false);
  const [pensionato, setPensionato] = useState<PensionatoData>(INITIAL_PENSIONATO_STATE);
  const [dipendente, setDipendente] = useState<DipendenteData>(INITIAL_DIPENDENTE_STATE);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("creditplan_form_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.setValue("nome", parsed.nome || "");
        form.setValue("cognome", parsed.cognome || "");
        form.setValue("mail", parsed.mail || "");
        form.setValue("telefono", parsed.telefono || "");
        if (parsed.contactInfoSubmitted) setContactInfoSubmitted(true);
        if (parsed.userPosition) setUserPosition(parsed.userPosition);
        if (parsed.pensionato) setPensionato(parsed.pensionato);
        if (parsed.dipendente) setDipendente(parsed.dipendente);
      } catch (e) {
        console.error("Error loading saved form data:", e);
      }
    }
  }, [form]);

  // Save progress to localStorage
  useEffect(() => {
    const formData = {
      nome: form.watch("nome"),
      cognome: form.watch("cognome"),
      mail: form.watch("mail"),
      telefono: form.watch("telefono"),
      contactInfoSubmitted,
      userPosition,
      pensionato,
      dipendente,
    };
    localStorage.setItem("creditplan_form_data", JSON.stringify(formData));
  }, [
    form.watch("nome"),
    form.watch("cognome"),
    form.watch("mail"),
    form.watch("telefono"),
    contactInfoSubmitted,
    userPosition,
    pensionato,
    dipendente,
  ]);

  const getCurrentStep = useCallback(() => {
    if (showPersonalInfo) return 1;
    if (!userPosition) return 2;
    if (userPosition === "PENSIONATO") {
      return 2 + pensionato.step;
    } else {
      return 2 + dipendente.step;
    }
  }, [showPersonalInfo, userPosition, pensionato.step, dipendente.step]);

  const getTotalSteps = useCallback(() => {
    if (!userPosition) return 2;
    return userPosition === "PENSIONATO" ? 7 : 10;
  }, [userPosition]);

  const calculateProgress = useCallback(() => {
    const current = getCurrentStep();
    const total = getTotalSteps();
    return Math.round((current / total) * 100);
  }, [getCurrentStep, getTotalSteps]);

  const resetForm = useCallback(() => {
    localStorage.removeItem("creditplan_form_data");
    setShowPersonalInfo(true);
    setUserPosition(null);
    setIsSubmitted(false);
    setIsLoading(false);
    setContactInfoSubmitted(false);
    setPensionato(INITIAL_PENSIONATO_STATE);
    setDipendente(INITIAL_DIPENDENTE_STATE);
  }, []);

  return {
    showPersonalInfo,
    setShowPersonalInfo,
    userPosition,
    setUserPosition,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    contactInfoSubmitted,
    setContactInfoSubmitted,
    pensionato,
    setPensionato,
    dipendente,
    setDipendente,
    getCurrentStep,
    getTotalSteps,
    calculateProgress,
    resetForm,
  };
}

