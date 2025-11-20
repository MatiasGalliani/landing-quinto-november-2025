import { useState, useCallback } from "react";
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
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [userPosition, setUserPosition] = useState<UserPosition>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactInfoSubmitted, setContactInfoSubmitted] = useState(false);
  const [pensionato, setPensionato] = useState<PensionatoData>(INITIAL_PENSIONATO_STATE);
  const [dipendente, setDipendente] = useState<DipendenteData>(INITIAL_DIPENDENTE_STATE);

  const getCurrentStep = useCallback(() => {
    if (!userPosition) return 1; // Will be overridden by initialStep in FormSection
    // After position selection, add 3 to the internal step (3 initial steps + current step)
    if (userPosition === "PENSIONATO") {
      return 3 + pensionato.step;
    } else {
      return 3 + dipendente.step;
    }
  }, [userPosition, pensionato.step, dipendente.step]);

  const getTotalSteps = useCallback(() => {
    if (!userPosition) return 3; // 3 initial steps before position selection
    // Total steps including the 3 initial ones:
    // Pensionato: 3 initial + 3 specific (Contact, Type, Entity) = 6 total
    // Dipendente: 3 initial + 6 specific (Contact, Type, Contract, NumEmp, Date, TFR) = 9 total
    return userPosition === "PENSIONATO" ? 6 : 9;
  }, [userPosition]);

  const calculateProgress = useCallback(() => {
    const current = getCurrentStep();
    const total = getTotalSteps();
    return Math.round((current / total) * 100);
  }, [getCurrentStep, getTotalSteps]);

  const resetForm = useCallback(() => {
    setShowPersonalInfo(false);
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

