'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import RankableList from '@/components/RankableList';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';
import type { Value } from '@/lib/types';

export default function RankPage() {
  const router = useRouter();
  const {
    rankedValues,
    setRankedValues,
    sessionId,
    top5,
  } = useAssessmentStore();

  // Redirect if no session or no top5 selected
  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
      return;
    }
    if (top5.length === 0) {
      router.replace('/assess/narrow');
    }
  }, [sessionId, top5.length, router]);

  // Initialize rankedValues from top5 if empty
  useEffect(() => {
    if (top5.length > 0 && rankedValues.length === 0) {
      setRankedValues([...top5]);
    }
  }, [top5, rankedValues.length, setRankedValues]);

  // Convert IDs to Value objects
  const rankedValueObjects = useMemo(() => {
    return rankedValues
      .map((id) => VALUES_BY_ID[id])
      .filter(Boolean);
  }, [rankedValues]);

  // Handle reorder
  const handleReorder = useCallback((newOrder: Value[]) => {
    setRankedValues(newOrder.map((v) => v.id));
  }, [setRankedValues]);

  const handleContinue = () => {
    router.push('/assess/define');
  };

  if (!sessionId || rankedValueObjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const topValue = rankedValueObjects[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Rank Your Values
        </h1>
        <p className="text-gray-600">
          If you could only keep <strong>ONE</strong> value, which would it be?
          <br />
          <span className="text-gray-500">That&apos;s your #1.</span>
        </p>
      </div>

      {/* Current #1 highlight */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
        <p className="text-sm text-indigo-600 font-medium">
          Your #1 value is currently:
        </p>
        <p className="text-xl font-bold text-indigo-900 mt-1">
          {topValue?.name}
        </p>
      </div>

      {/* Rankable List */}
      <RankableList
        values={rankedValueObjects}
        onReorder={handleReorder}
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
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Continue with {topValue?.name} as #1
        </button>
      </motion.div>
    </motion.div>
  );
}
