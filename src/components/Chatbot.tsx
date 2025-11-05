'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { DialogTitle } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Ciao! Sono Eugenio, il tuo consulente digitale di Creditplan. Come posso aiutarti con la tua Cessione del Quinto?',
  sender: 'bot',
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  "Cos'è la Cessione del Quinto?",
  'Quali sono i costi e le commissioni associate?',
  'Quanto tempo serve per ottenere il prestito?',
  'Quali requisiti devo avere per richiedere la Cessione del Quinto?',
  'Esiste un limite massimo di età per la Cessione del Quinto?',
  'Cosa succede se non raggiungo i requisiti per rinnovare una Cessione del Quinto già in corso?',
  'Perché dovrei scegliere Creditplan?',
  'Posso richiedere il prestito se sono stato segnalato come cattivo pagatore?',
  'È possibile estinguere anticipatamente la Cessione del Quinto?',
  'Quanto costa la consulenza iniziale con Creditplan?'
] as const;

const QUICK_REPLIES_PAGE_SIZE = 5;
const QUICK_REPLIES_TOTAL_PAGES = Math.ceil(
  QUICK_REPLIES.length / QUICK_REPLIES_PAGE_SIZE
);

const PREDEFINED_RESPONSES: Record<typeof QUICK_REPLIES[number], string> = {
  "Cos'è la Cessione del Quinto?":
    "La Cessione del Quinto è un prestito personale con una rata mensile che non supera il quinto (20%) del tuo stipendio netto o della tua pensione, trattenuta direttamente in busta paga o sulla pensione.",
  'Quali sono i costi e le commissioni associate?':
    "Le commissioni di mediazione sono regolamentate secondo la normativa vigente e vengono sempre comunicate in modo trasparente nel preventivo TAEG (Tasso Annuo Effettivo Globale). Il TAEG comprende tutti i costi, inclusi: spese di istruttoria, commissioni di mediazione, costi assicurativi obbligatori per legge e commissioni bancarie. Riceverai un preventivo personalizzato e dettagliato prima di qualsiasi impegno, in conformità con le normative di trasparenza bancaria.",
  'Quanto tempo serve per ottenere il prestito?':
    "Con Creditplan puoi ottenere la liquidità necessaria in pochi giorni grazie ai nostri partner bancari specializzati e al team qualificato.",
  'Quali requisiti devo avere per richiedere la Cessione del Quinto?':
    "Puoi richiedere la Cessione del Quinto se sei un lavoratore dipendente (pubblico o privato) con contratto a tempo indeterminato o un pensionato. Non è richiesto alcun garante.",
  'Esiste un limite massimo di età per la Cessione del Quinto?':
    "Sì, i pensionati possono ottenere il prestito fino a 89 anni alla scadenza del finanziamento.",
  'Cosa succede se non raggiungo i requisiti per rinnovare una Cessione del Quinto già in corso?':
    "In caso di mancato raggiungimento dei termini per il rinnovo, possiamo valutare insieme la Delegazione di Pagamento, una seconda trattenuta sullo stipendio che permette di ottenere ulteriore liquidità.",
  'Perché dovrei scegliere Creditplan?':
    "Offriamo tempi rapidi di erogazione. Collaboriamo con partner bancari convenzionati INPS, garantendo sicurezza e affidabilità. Abbiamo un team dedicato di professionisti a tua disposizione. Nessuna spesa aggiuntiva: la consulenza è gratuita. Tassi altamente competitivi.",
  'Posso richiedere il prestito se sono stato segnalato come cattivo pagatore?':
    "Sì, la Cessione del Quinto è accessibile anche in caso di segnalazioni o protesti, in quanto non si basa sulla tua storia creditizia, ma sul tuo stipendio o pensione.",
  'È possibile estinguere anticipatamente la Cessione del Quinto?':
    "Sì, puoi estinguere anticipatamente il prestito in qualsiasi momento beneficiando della riduzione degli interessi residui.",
  'Quanto costa la consulenza iniziale con Creditplan?':
    "Nessun costo accessorio."
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickRepliesPage, setQuickRepliesPage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userText: string): string => {
    if (PREDEFINED_RESPONSES[userText as typeof QUICK_REPLIES[number]]) {
      return PREDEFINED_RESPONSES[userText as typeof QUICK_REPLIES[number]];
    }

    const lowerText = userText.toLowerCase();

    if (lowerText.includes('quanto') && (lowerText.includes('ottenere') || lowerText.includes('posso'))) {
      return 'Con la Cessione del Quinto puoi ottenere fino a 75.000€! L\'importo esatto dipende dal tuo stipendio e dalla durata del finanziamento. Vuoi che un nostro consulente ti calcoli l\'importo preciso?';
    }

    if (lowerText.includes('requisiti') || lowerText.includes('condizioni')) {
      return 'I requisiti principali sono: essere dipendente pubblico o privato con contratto a tempo indeterminato, avere almeno 18 anni, e un reddito mensile sufficiente. Vuoi verificare se hai tutti i requisiti?';
    }

    if (lowerText.includes('tempo') || lowerText.includes('quanto ci vuole') || lowerText.includes('veloce')) {
      return 'Il processo è velocissimo! Approvazione preliminare in 24 ore lavorative e denaro sul tuo conto in 48 ore operative. Vuoi iniziare subito la richiesta?';
    }

    if (lowerText.includes('consulente') || lowerText.includes('parlare') || lowerText.includes('chiamare')) {
      return 'Perfetto! Un nostro consulente esperto sarà felice di aiutarti. Compila il form sulla pagina con i tuoi dati e ti richiameremo entro 2 ore. Oppure chiamaci direttamente al numero che trovi sul sito!';
    }

    if (lowerText.includes('costo') || lowerText.includes('commissioni') || lowerText.includes('quanto costa')) {
      return 'La consulenza iniziale è completamente gratuita e l\'istruttoria non ha costi! Ti garantiamo massima trasparenza su tutte le condizioni fin dall\'inizio, senza sorprese.';
    }

    if (lowerText.includes('documenti') || lowerText.includes('cosa serve')) {
      return 'Per la richiesta preliminare non servono documenti! Basta compilare il form. I documenti necessari ti verranno richiesti solo dopo, durante la fase di istruttoria, e ti guideremo passo passo.';
    }

    if (lowerText.includes('ciao') || lowerText.includes('salve') || lowerText.includes('buongiorno') || lowerText.includes('buonasera')) {
      return 'Ciao! 👋 Sono qui per aiutarti con qualsiasi domanda sulla Cessione del Quinto. Cosa vorresti sapere?';
    }

    if (lowerText.includes('grazie')) {
      return 'Figurati! Sono qui per questo. C\'è altro che posso fare per te?';
    }

    // Default response
    return 'Grazie per la tua domanda! Per una risposta precisa e personalizzata, ti consiglio di parlare con un nostro consulente esperto. Compila il form sulla pagina e ti richiameremo subito, oppure continua a farmi domande!';
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-blue-100">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-center">
          <VisuallyHidden.Root>
            <DialogTitle>Chat con un consulente Creditplan</DialogTitle>
          </VisuallyHidden.Root>
          <Image
            src="https://creditplan.it/wp-content/uploads/2025/10/Eugenio.svg"
            alt="Eugenio"
            width={100}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-white border-t border-slate-100">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${quickRepliesPage * 100}%)` }}
          >
            {Array.from({ length: QUICK_REPLIES_TOTAL_PAGES }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                className="min-w-full flex flex-wrap gap-2"
              >
                {QUICK_REPLIES.slice(
                  pageIndex * QUICK_REPLIES_PAGE_SIZE,
                  pageIndex * QUICK_REPLIES_PAGE_SIZE + QUICK_REPLIES_PAGE_SIZE
                ).map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        {QUICK_REPLIES_TOTAL_PAGES > 1 && (
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={() =>
                setQuickRepliesPage(prev => (prev + 1) % QUICK_REPLIES_TOTAL_PAGES)
              }
              disabled={isTyping}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:via-indigo-700 px-5 py-2 rounded-full shadow-lg shadow-blue-500/40 transition-transform duration-200 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label={quickRepliesPage === QUICK_REPLIES_TOTAL_PAGES - 1 ? 'Mostra le prime domande' : 'Mostra altre domande'}
            >
              <span>
                {quickRepliesPage === QUICK_REPLIES_TOTAL_PAGES - 1
                  ? 'Torna alle prime domande'
                  : 'Scopri altre domande'}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${quickRepliesPage === QUICK_REPLIES_TOTAL_PAGES - 1 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

