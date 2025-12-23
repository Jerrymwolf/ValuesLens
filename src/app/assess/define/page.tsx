'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceRecorder from '@/components/VoiceRecorder';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';

const HELPER_PROMPTS = [
  'Why did you choose this as your #1?',
  'What does living this value look like day-to-day?',
  'When have you felt most aligned with this value?',
  'How do you know when you\'re honoring this value?',
  'What decision would be easy if you fully lived this value?',
];

const MIN_WORDS = 15;

export default function DefinePage() {
  const router = useRouter();
  const {
    rankedValues,
    transcript,
    setTranscript,
    sessionId,
  } = useAssessmentStore();

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Redirect if no session or no ranking
  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
      return;
    }
    if (rankedValues.length === 0) {
      router.replace('/assess/rank');
    }
  }, [sessionId, rankedValues.length, router]);

  // Rotate helper prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((i) => (i + 1) % HELPER_PROMPTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Get the #1 value
  const topValue = useMemo(() => {
    if (rankedValues.length === 0) return null;
    return VALUES_BY_ID[rankedValues[0]];
  }, [rankedValues]);

  const handleTranscriptChange = useCallback((text: string) => {
    setTranscript(text);
  }, [setTranscript]);

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  const canContinue = wordCount >= MIN_WORDS;

  const handleContinue = () => {
    router.push('/assess/processing');
  };

  if (!sessionId || !topValue) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-indigo-600 font-medium mb-2">
          Your #1 Value
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {topValue.name}
        </h1>
        <p className="text-gray-500 text-sm">
          {topValue.cardText}
        </p>
      </div>

      {/* Main prompt */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-100">
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          What does <span className="text-indigo-700">{topValue.name}</span> mean to YOU?
        </h2>
        <p className="text-gray-600 text-center text-sm">
          Share in your own words — speak or type below
        </p>
      </div>

      {/* Rotating helper prompts */}
      <div className="h-12 mb-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPromptIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-500 italic text-center"
          >
            💡 {HELPER_PROMPTS[currentPromptIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Voice Recorder */}
      <VoiceRecorder
        onTranscriptChange={handleTranscriptChange}
        minWords={MIN_WORDS}
        placeholder={`What does ${topValue.name} mean to you? Why is it your #1?`}
      />

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {canContinue
            ? 'Generate My Definitions'
            : `Share a bit more (${MIN_WORDS - wordCount} words to go)`}
        </button>
      </motion.div>

      {/* Skip option */}
      <button
        onClick={handleContinue}
        className="mt-4 text-gray-400 hover:text-gray-600 text-sm text-center transition-colors"
      >
        Skip — use AI-generated definition
      </button>
    </motion.div>
  );
}
