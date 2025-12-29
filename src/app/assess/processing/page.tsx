'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const INSPIRATIONAL_QUOTES = [
  { text: 'Your values are your compass in life.', author: 'Unknown' },
  { text: 'It\'s not hard to make decisions when you know what your values are.', author: 'Roy Disney' },
  { text: 'Values are like fingerprints. Nobody\'s are the same, but you leave them all over everything you do.', author: 'Elvis Presley' },
  { text: 'The things that matter most must never be at the mercy of the things that matter least.', author: 'Goethe' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
  { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
];

const PROCESSING_MESSAGES = [
  'Analyzing your values profile...',
  'Understanding your priorities...',
  'Crafting personalized definitions...',
  'Creating behavioral anchors...',
  'Finalizing your values map...',
];

export default function ProcessingPage() {
  const router = useRouter();
  const {
    sessionId,
    rankedValues,
    transcript,
    sortedValues,
    setDefinitions,
  } = useAssessmentStore();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const hasStarted = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // Redirect if no session
  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
      return;
    }
    if (rankedValues.length === 0) {
      router.replace('/assess/rank');
    }
  }, [sessionId, rankedValues.length, router]);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % INSPIRATIONAL_QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Rotate processing messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Call AI API
  useEffect(() => {
    if (hasStarted.current || !sessionId || rankedValues.length === 0) return;
    hasStarted.current = true;

    generateDefinitions();
  }, [sessionId, rankedValues]);

  const generateDefinitions = async () => {
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          rankedValues,
          transcript,
          sortedValues,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate definitions');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Store definitions
      setDefinitions(data.definitions);

      // Navigate to review
      router.push('/assess/review');
    } catch (err) {
      console.error('AI generation error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    hasStarted.current = false;
    generateDefinitions();
  };

  const handleSkip = () => {
    // Use fallback definitions
    router.push('/assess/review');
  };

  if (!sessionId) {
    return null;
  }

  const currentQuote = INSPIRATIONAL_QUOTES[quoteIndex];
  const currentMessage = PROCESSING_MESSAGES[messageIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      {error ? (
        /* Error State */
        <div className="w-full max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full py-3 bg-brand-600 text-white font-medium rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Continue with basic definitions
            </button>
          </div>
        </div>
      ) : (
        /* Loading State */
        <>
          {/* Animated spinner */}
          <div className="relative w-24 h-24 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-brand-100"
              style={{ borderTopColor: '#0279AF' }}
              animate={prefersReducedMotion ? {} : { rotate: 360 }}
              transition={prefersReducedMotion ? {} : { duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
          </div>

          {/* Processing message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-gray-900 mb-8"
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>

          {/* Quote */}
          <div className="max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 italic mb-2">
                  &ldquo;{currentQuote.text}&rdquo;
                </p>
                <p className="text-gray-400 text-sm">
                  — {currentQuote.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-brand-300"
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={prefersReducedMotion ? {} : {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
