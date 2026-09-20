import { useCallback, useState } from 'react';
import { translations } from '../data/translations';

const greeting = { from: 'ai', text: 'Hi Alex. I can help compare delivery options, explain an order, or flag an ops risk.' };

export const aiQuickActions = (role) => (role === 'ops'
  ? ['Forecast demand', 'Optimize dispatch', 'Find service risks', 'Review refund queue']
  : ['Explain my order', 'Check delivery price', 'Find my receipt', 'Track driver ETA', 'Request a refund']);

const FALLBACK_ANSWER = 'I can help with bookings, delivery status, pricing, rewards, seller performance, or operations. What should we look at?';

/**
 * Keyword-to-answer table. The first entry whose keywords match the question
 * wins, except for `sideEffect` entries which also fire an action.
 */
export const aiAnswerTable = [
  { keywords: ['price', 'cost'], answer: 'The standard water price is GH₵300, with a buyer discount to GH₵250. The 15% buyer commission is GH₵37.50 and Hubtel payment is held in escrow.' },
  { keywords: ['status', 'order'], answer: 'Your newest order is confirmed. A seller can move it to En Route, then Delivered. You release payment only after confirming receipt.' },
  { keywords: ['dispatch', 'seller'], answer: 'Priority recommendation: assign AQ-1051 to the nearest verified seller with a 4.8+ rating and a 96%+ completion rate. This minimizes late-delivery risk.' },
  { keywords: ['forecast', 'demand'], answer: 'Tomorrow’s demand signal is strongest in East Legon and Osu between 07:00–10:00. Pre-position 6 available trucks and keep 2 as reserve capacity.' },
  { keywords: ['receipt'], answer: 'Your receipt is available in Recent deliveries. Choose Receipt on a completed order to download or email the Hubtel payment record.' },
  { keywords: ['driver', 'position', 'eta'], answer: 'For an En Route order, choose Driver position in Recent deliveries. The seller app shares the latest ETA; AquaLink does not expose an unverified live map.' },
  { keywords: ['support', 'agent'], answer: 'You can call 0545009046, email support@aqualink.gh, message WhatsApp at 0545009046, or open a ticket from the Human support card.' },
  {
    keywords: ['refund'],
    answer: 'I can open a refund request for AQ-1048. Ops will review the order evidence and email you with the decision.',
    sideEffect: ({ requestRefund }) => requestRefund('AQ-1048'),
  },
];

/**
 * Pure responder: maps a free-text question to an answer, optionally running a
 * side effect (such as opening a refund) and prefixing the localised support line.
 */
export const getAiAnswer = (question, { language = 'en', requestRefund } = {}) => {
  const lowerQuestion = question.toLowerCase();
  const match = aiAnswerTable.find((entry) =>
    entry.keywords.some((keyword) => lowerQuestion.includes(keyword))
  );

  if (!match) return FALLBACK_ANSWER;
  if (match.sideEffect && requestRefund) match.sideEffect({ requestRefund });

  const support = translations[language]?.support;
  return language !== 'en' && support ? `${support} · ${match.answer}` : match.answer;
};

/**
 * Owns the Aqua AI panel: open state, draft input, message history and the
 * keyword-matched responder that can also trigger side effects (refunds).
 */
export function useAquaAi({ language, requestRefund } = {}) {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([greeting]);

  const askAi = useCallback((event) => {
    event.preventDefault();
    const question = aiInput.trim();
    if (!question) return;
    const answer = getAiAnswer(question, { language, requestRefund });
    setAiMessages((messages) => [...messages, { from: 'user', text: question }, { from: 'ai', text: answer }]);
    setAiInput('');
  }, [aiInput, language, requestRefund]);

  const toggleAi = useCallback(() => setAiOpen((open) => !open), []);
  const closeAi = useCallback(() => setAiOpen(false), []);

  return { aiOpen, toggleAi, closeAi, aiInput, setAiInput, aiMessages, askAi };
}

export default useAquaAi;
