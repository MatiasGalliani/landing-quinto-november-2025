export type UserPosition = "PENSIONATO" | "DIPENDENTE" | null;

export interface PersonalInfo {
  nome: string;
  cognome: string;
  mail: string;
  telefono: string;
}

export interface PensionatoData {
  step: number;
  amount: number;
  pension: number;
  ente: string;
  tipo: string;
  error: string;
}

export interface DipendenteData {
  step: number;
  amount: number;
  salary: number;
  tipo: string;
  contratto: string;
  numDipendenti: string;
  dataAssunzione: string;
  tfr: string;
  error: string;
}

export interface FormState {
  showPersonalInfo: boolean;
  userPosition: UserPosition;
  isSubmitted: boolean;
  isLoading: boolean;
  contactInfoSubmitted: boolean;
  pensionato: PensionatoData;
  dipendente: DipendenteData;
}

export const INITIAL_PENSIONATO_STATE: PensionatoData = {
  step: 1,
  amount: 25000,
  pension: 1200,
  ente: "",
  tipo: "",
  error: "",
};

export const INITIAL_DIPENDENTE_STATE: DipendenteData = {
  step: 1,
  amount: 30000,
  salary: 1800,
  tipo: "",
  contratto: "",
  numDipendenti: "",
  dataAssunzione: "",
  tfr: "",
  error: "",
};

export const ENTI_PENSIONISTICI = [
  "INPS",
  "EX INPDAP",
  "ALTRO ENTE",
  "PENSIONATO ITALIANO RESIDENTE ESTERO",
] as const;

export const TIPOLOGIE_PENSIONE = [
  "PENSIONE DI VECCHIAIA",
  "PENSIONE DI ANZIANITA'",
  "PENSIONE DI REVERSIBILITA'",
  "PENSIONE DI INVALIDITA'",
  "INVALIDITA' CIVILE",
  "APE SOCIAL",
  "ASSEGNO SOCIALE",
  "ALTRA TIPOLOGIA",
] as const;

export const NON_FINANCEABLE_PENSION_TYPES = [
  "INVALIDITA' CIVILE",
  "APE SOCIAL",
  "ASSEGNO SOCIALE",
] as const;

export const TIPOLOGIE_DIPENDENTE = [
  "PRIVATO",
  "PUBBLICO",
  "PARASUBORDINATO",
] as const;

export const TIPOLOGIE_CONTRATTO = [
  "INDETERMINATO",
  "DETERMINATO",
  "ALTRO",
] as const;

