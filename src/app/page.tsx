'use client';

import { useState, memo, useCallback, useMemo, lazy, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { StructuredData } from "@/components/StructuredData";

// Lazy load heavy sections below the fold for faster initial load
const FormSection = dynamic(() => import('@/components/FormSection').then(mod => ({ default: mod.FormSection })), {
  loading: () => <div className="h-[600px] animate-pulse bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl" />
});

// Extract static data outside component to prevent recreation
const FAQ_ITEMS = [
  {
    question: "Cos'è la Cessione del Quinto?",
    answer: "La cessione del quinto è un prestito garantito con trattenuta diretta in busta paga o sulla pensione. Può essere richiesto senza dovere fornire motivazioni e l'importo massimo della rata non può eccedere il 20% dello stipendio netto mensile (un quinto)."
  },
  {
    question: "Quali sono i costi e le commissioni associate?",
    answer: "Nessun costo o commissioni accessorie; l'importo richiesto viene erogato \"chiavi in mano\"."
  },
  {
    question: "Quanto tempo serve per ottenere il prestito?",
    answer: "Con Creditplan puoi ottenere la liquidità necessaria in pochi giorni grazie ai nostri partner bancari specializzati e al team qualificato."
  },
  {
    question: "Quali requisiti devo avere per richiedere la Cessione del Quinto?",
    answer: "Puoi richiedere la Cessione del Quinto se sei un lavoratore dipendente (pubblico/statale o privato) con contratto a tempo indeterminato o un pensionato. Non è richiesto alcun garante."
  },
  {
    question: "Esiste un limite massimo di età per la Cessione del Quinto?",
    answer: "Sì, i pensionati possono ottenere il prestito fino a 89 anni alla scadenza del finanziamento."
  },
  {
    question: "Cosa succede se non raggiungo i requisiti per rinnovare una Cessione del Quinto già in corso?",
    answer: "In caso di mancato raggiungimento dei termini per il rinnovo, possiamo valutare insieme la Delegazione di Pagamento, una seconda trattenuta sullo stipendio che permette di ottenere ulteriore liquidità."
  },
  {
    question: "Perché dovrei scegliere Creditplan?",
    answer: "Le nostre convenzioni bancarie con i primari partner sul mercato, ci permettono di avere tassi competitivi e tempi rapidi di erogazione."
  },
  {
    question: "Posso richiedere il prestito se sono stato segnalato come cattivo pagatore?",
    answer: "Sì, la Cessione del Quinto è accessibile anche in caso di segnalazioni o protesti, in quanto non tiene conto delle segnalazioni nelle banche dati pubbliche."
  },
  {
    question: "È possibile estinguere anticipatamente la Cessione del Quinto?",
    answer: "Sì, puoi estinguere anticipatamente il prestito in qualsiasi momento beneficiando dello storno degli interessi futuri dovuti."
  },
  {
    question: "Quanto costa la consulenza con Creditplan?",
    answer: "Nessun costo accessorio."
  }
] as const;

const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

const BENEFITS_DATA = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "blue",
    title: "Erogazione rapida",
    description: "In soli 48 ore operative"
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "green",
    title: "100% sicuro",
    description: "Certificato e garantito"
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "indigo",
    title: "Tasso fisso",
    description: "Rata fissa e importo costante"
  }
] as const;

// Memoized Benefit Card Component
const BenefitCard = memo(({ icon, color, title, description }: {
  icon: string;
  color: string;
  title: string;
  description: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200 hover:border-green-200",
    indigo: "bg-indigo-100 text-indigo-600 border-indigo-200 hover:border-indigo-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-200"
  };

  const bgClass = color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100';
  const textClass = color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
      <div className={`flex-shrink-0 w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
        <svg className={`w-5 h-5 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
});

BenefitCard.displayName = 'BenefitCard';

// Memoized FAQ Item Component
const FAQItem = memo(({ 
  faq, 
  index, 
  isOpen, 
  onToggle 
}: { 
  faq: typeof FAQ_ITEMS[number]; 
  index: number; 
  isOpen: boolean; 
  onToggle: () => void;
}) => (
  <div className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
    isOpen 
      ? 'border-blue-200 shadow-lg shadow-blue-100/50' 
      : 'border-slate-200 shadow-sm hover:border-blue-100 hover:shadow-md'
  }`} itemScope itemType="https://schema.org/Question">
    {/* Gradient accent line - only visible when open */}
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}></div>
    
    <button
      onClick={onToggle}
      className="w-full px-6 lg:px-8 py-6 text-left flex items-start justify-between gap-4 group"
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Question number badge */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md' 
            : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
        }`}>
          {index + 1}
        </div>
        
        <h3 className={`text-base lg:text-lg font-bold transition-colors duration-300 ${
          isOpen 
            ? 'text-blue-600' 
            : 'text-slate-900 group-hover:text-blue-600'
        }`} itemProp="name">
          {faq.question}
        </h3>
      </div>
      
      {/* Arrow icon */}
      <div className="flex-shrink-0 mt-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-blue-50 rotate-180' 
            : 'bg-slate-50 group-hover:bg-blue-50'
        }`}>
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${
              isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </button>
    
    {/* Answer section */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="px-6 lg:px-8 pb-6">
        <div className="pl-12 pr-4">
          <div className="pt-2 border-t border-slate-100" itemScope itemType="https://schema.org/Answer">
            <p className="text-slate-600 leading-relaxed pt-4 text-[15px] lg:text-base" itemProp="text">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

FAQItem.displayName = 'FAQItem';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Memoize scroll handler
  const scrollToForm = useCallback(() => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback: try to find the form
      const formElement = document.querySelector('form');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Memoize FAQ toggle handlers
  const handleFaqToggle = useCallback((index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden" itemScope itemType="https://schema.org/WebPage">
      <StructuredData />

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-4 lg:py-6" role="banner">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col md:block">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan - Logo aziendale servizi di mediazione creditizia per cessione del quinto"
                width={280}
                height={96}
                quality={60}
                priority
                sizes="(max-width: 768px) 200px, 280px"
                className="w-auto h-8 lg:h-10 mt-4 lg:mt-0"
                itemProp="logo"
              />
            </div>
          
            <div className="flex items-center gap-4">
            {/* OAM Badge */}
            <a 
              href="https://www.organismo-am.it/b/0/06197620963/F311BEF5-24B7-4A32-AB79-567598386DBC/g.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex flex-col gap-1 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 leading-tight">Iscritti al registro</span>
                  <span className="text-sm font-bold text-slate-900 leading-tight">OAM M30</span>
                </div>
                <Image
                  src="https://www.organismo-am.it/b/0/c3f18c274847902265f07537ce366a8eJO5NMdSW1LRcd_pl_8_eq_/1.png"
                  alt="Creditplan iscritto al registro OAM M30 - Organismo Agenti e Mediatori - Verifica autorizzazione"
                  width={44}
                  height={44}
                  quality={60}
                  loading="lazy"
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-blue-600 font-medium">
                <span>Verifica in tempo reale</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-0 lg:pt-8 pb-20" itemScope itemType="https://schema.org/FinancialProduct">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <article className="space-y-8">
              
              {/* Main Headline */}
              <header className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold lg:font-black leading-[1.05] tracking-tight" itemProp="name">
                  <span className="block text-slate-900">
                    Ottieni fino a 75.000€
                  </span>
                  <span className="block text-slate-900">
                    con la cessione del quinto
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 font-light max-w-xl leading-relaxed" itemProp="description">
                  Istruttoria rapida ed approvazione entro 24/48 ore
                </p>
              </header>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-4">
                {BENEFITS_DATA.map((benefit, idx) => (
                  <BenefitCard
                    key={idx}
                    icon={benefit.icon}
                    color={benefit.color}
                    title={benefit.title}
                    description={benefit.description}
                  />
                ))}
              </div>

              {/* Google Reviews Social Proof */}
              <div className="inline-flex items-center gap-4 pt-4 bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                  </svg>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {STAR_RATINGS.map((i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-tight">
                      <span className="font-bold text-slate-900">4.9/5</span> su Google
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Oltre 2.000 recensioni verificate
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Right: Form Card */}
            <FormSection />
          </div>
        </div>
      </section>

      {/* Why Choose Creditplan Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20" aria-labelledby="why-creditplan-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="why-creditplan-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Perché scegliere Creditplan?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Semplifichiamo ogni aspetto del tuo finanziamento
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Benefit 1 - Fast Approval */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Velocità garantita</h3>
                <p className="text-slate-600 leading-relaxed">
                  Approvazione preliminare in sole <span className="font-bold text-blue-600">24 ore</span> lavorative
                </p>
              </div>
            </div>

            {/* Benefit 2 - Predictability */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Tranquillità totale</h3>
                <p className="text-slate-600 leading-relaxed">
                  <span className="font-bold text-emerald-600">Rata fissa</span> e importo costante per tutta la durata
                </p>
              </div>
            </div>

            {/* Benefit 4 - No Hidden Costs */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-200">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Massima trasparenza</h3>
                <p className="text-slate-600 leading-relaxed">
                  <span className="font-bold text-amber-600">Nessun costo nascosto</span>, istruttoria gratuita e comunicazioni incluse
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Partnerships Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30" aria-labelledby="bank-partnerships-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h2 id="bank-partnerships-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Le nostre convenzioni bancarie
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Collaboriamo con i primari partner sul mercato per garantirti tassi competitivi e tempi rapidi
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Banca Sistema */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/79/Banca_Sistema_logo.svg"
                alt="Banca Sistema - Partner bancario Creditplan per cessione del quinto"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Capital Fin */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://www.bancaifis.it/app/uploads/2025/03/CAPITALFIN_Logo_Footer_Blu.svg"
                alt="Capital Fin - Partner bancario Creditplan per prestiti e finanziamenti"
                width={260}
                height={104}
                className="w-full h-auto max-h-[5.5rem] object-contain grayscale group-hover:grayscale-0 transition-all duration-300 mt-4 ml-2"
                loading="lazy"
              />
            </div>

            {/* Fincontinuo */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://www.fincontinuo.com/hubfs/fincontinuo-logo.svg"
                alt="Fincontinuo - Partner finanziario Creditplan per cessione del quinto"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Bank Logo 4 */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ68VRQtS9RBsKX4NXmQNzByi5hqhEGf7vc1w&s"
                alt="Partner bancario convenzionato Creditplan per prestiti e finanziamenti"
                width={200}
                height={80}
                className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Last 3 logos - centered */}
            <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-wrap justify-center gap-6 lg:gap-8">
              {/* Bank Logo 5 */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_zu4rkVrkobpR88917ZnpI4RPD3zz3tXRw&s"
                  alt="Partner bancario convenzionato Creditplan per cessione del quinto"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* IBL Banca */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://thebanks.eu/img/logos/IBL_Banca.png"
                  alt="IBL Banca - Partner bancario Creditplan per cessione del quinto e prestiti"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Bank Logo 7 */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3zTLQW74Q-2PPo5vC0p0tkJ_xOYRUJUbDiA&s"
                  alt="Partner bancario convenzionato Creditplan per finanziamenti e prestiti"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Partner convenzionati INPS</span> - Garantiamo sicurezza e affidabilità
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50" aria-labelledby="how-it-works-heading" itemScope itemType="https://schema.org/HowTo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4" itemProp="name">
              Come funziona
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" itemProp="description">
              Un processo semplice e veloce in soli 3 passaggi
            </p>
          </header>

          {/* Trust Image */}
          <div className="max-w-3xl mx-auto">
            <Image
              src="https://creditplan.it/wp-content/uploads/2025/11/Progetto-senza-titolo-3.png"
              alt="Come funziona la cessione del quinto con Creditplan - Processo in 3 semplici passaggi"
              width={1200}
              height={600}
              quality={60}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative group" itemScope itemType="https://schema.org/HowToStep" itemProp="step">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white" itemProp="position">1</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3" itemProp="name">Compila il form</h3>
                <p className="text-slate-600 leading-relaxed" itemProp="text">
                  Inserisci i tuoi dati in meno di 2 minuti. Nessun documento richiesto in questa fase.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group" itemScope itemType="https://schema.org/HowToStep" itemProp="step">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white" itemProp="position">2</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3" itemProp="name">Ricevi la chiamata</h3>
                <p className="text-slate-600 leading-relaxed" itemProp="text">
                  Un nostro consulente esperto ti contatterà entro 2 ore per discutere la tua situazione.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group" itemScope itemType="https://schema.org/HowToStep" itemProp="step">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white" itemProp="position">3</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3" itemProp="name">Ricevi il denaro</h3>
                <p className="text-slate-600 leading-relaxed" itemProp="text">
                  Dopo l'approvazione, ricevi il tuo finanziamento sul conto in 48 ore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Image */}
            <div className="relative lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://creditplan.it/wp-content/uploads/2023/02/03_CSQ.jpg"
                  alt="Famiglia soddisfatta con Creditplan - Cessione del quinto per realizzare i propri progetti"
                  width={800}
                  height={600}
                  quality={60}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto object-cover select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
                />
              </div>
            </div>

            {/* Right: CTA Content */}
            <div className="lg:order-2">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 rounded-3xl p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-white bg-white/20 px-4 py-2 rounded-full mb-6">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>Oltre 2.000 famiglie soddisfatte</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                    Pronto a iniziare?
                  </h2>
                  <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
                    Unisciti a migliaia di clienti soddisfatti. Il tuo finanziamento è a portata di clic.
                  </p>
                  <Button 
                    onClick={scrollToForm}
                    className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Richiedi subito
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/20">
                    <div>
                      <div className="text-3xl font-bold text-white">48h</div>
                      <div className="text-sm text-blue-100">Tempo medio</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">98%</div>
                      <div className="text-sm text-blue-100">Soddisfazione</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 overflow-hidden" aria-labelledby="faq-heading" itemScope itemType="https://schema.org/FAQPage">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <h2 id="faq-heading" className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Domande Frequenti
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tutto quello che devi sapere sulla Cessione del Quinto.
            </p>
          </header>

          {/* FAQ Grid */}
          <div className="grid gap-4 lg:gap-5">
            {FAQ_ITEMS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFaqIndex === index}
                onToggle={() => handleFaqToggle(index)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-8 lg:p-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                  Hai altre domande?
                </h3>
                <p className="text-slate-600 mb-6">
                  I nostri consulenti sono pronti ad aiutarti. Nessun impegno, consulenza gratuita.
                </p>
                <Button 
                  onClick={scrollToForm}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Richiedi una consulenza gratuita
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-6">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Creditplan - Logo aziendale servizi di mediazione creditizia"
                width={280}
                height={96}
                quality={60}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-auto h-8 select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
              />
              <p className="text-sm text-slate-600" itemProp="copyrightHolder">
                © 2025 Creditplan Italia Network di Mediazione Credizia. Tutti i diritti riservati.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a 
                href="https://creditplan.it/wp-content/uploads/2023/04/Informativa-privacy.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="https://creditplan.it/trasparenza/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Trasparenza
              </a>
            </div>
          </div>
          
          {/* Designer Credit */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Designed and developed by Matias Galliani
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
