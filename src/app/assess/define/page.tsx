'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceRecorder from '@/components/VoiceRecorder';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';

const HELPER_PROMPTS = [
  'What does your #1 value mean to you personally?',
  'How does your #2 value show up in your daily life?',
  'When have you felt most aligned with your #3 value?',
  'How do these three values work together for you?',
  'What decisions become easier when you honor these values?',
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

  // Get all top 3 values
  const top3Values = useMemo(() => {
    return rankedValues.slice(0, 3).map(id => VALUES_BY_ID[id]).filter(Boolean);
  }, [rankedValues]);

  const handleTranscriptChange = useCallback((text: string) => {
    setTranscript(text);
  }, [setTranscript]);

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
  const canContinue = wordCount >= MIN_WORDS;

  const handleContinue = () => {
    router.push('/assess/processing');
  };

  if (!sessionId || top3Values.length === 0) {
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
        <p className="text-sm text-brand-600 font-medium mb-2">
          Your Top 3 Values
        </p>
        <div className="flex justify-center gap-4 mb-4">
          {top3Values.map((v, i) => (
            <div key={v.id} className="text-center">
              <span className="text-xs text-gray-500">#{i + 1}</span>
              <p className="font-semibold text-gray-900">{v.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main prompt */}
      <div className="bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl p-6 mb-6 border border-brand-100">
        <h2 className="text-xl font-semibold text-brand-900 text-center mb-2">
          Tell us about your top 3 values
        </h2>
        <p className="text-gray-600 text-center text-sm">
          Share what each means to you — our AI will create personalized definitions
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
        placeholder="Talk about what these values mean to you. Why did you rank them this way? How do they show up in your life?"
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
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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
