'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ValueSelector from '@/components/ValueSelector';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';

export default function NarrowPage() {
  const router = useRouter();
  const {
    sortedValues,
    top5,
    toggleTop5,
    setRankedValues,
    sessionId,
  } = useAssessmentStore();

  // Redirect if no session or sorting not complete
  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
      return;
    }
    if (sortedValues.very.length === 0) {
      router.replace('/assess/sort');
    }
  }, [sessionId, sortedValues.very.length, router]);

  // Convert IDs to Value objects
  const veryImportantValues = useMemo(() => {
    return sortedValues.very
      .map((id) => VALUES_BY_ID[id])
      .filter(Boolean);
  }, [sortedValues.very]);

  const handleContinue = () => {
    // Initialize ranked values with the top5 selection
    setRankedValues([...top5]);
    router.push('/assess/rank');
  };

  const minRequired = 3;
  const maxAllowed = 5;
  const canContinue = top5.length >= minRequired && top5.length <= maxAllowed;
  const hasEnoughValues = veryImportantValues.length >= minRequired;

  if (!sessionId || veryImportantValues.length === 0) {
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
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-2">
          Narrow to Your Top 5
        </h1>
        <p className="text-gray-600">
          If you could only keep 5 values, which would they be?
        </p>
      </div>

      {/* Edge case: Not enough "Very Important" values */}
      {!hasEnoughValues && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm">
            You marked only {veryImportantValues.length} value
            {veryImportantValues.length !== 1 ? 's' : ''} as Very Important.
            You need at least {minRequired} to continue.
          </p>
          <button
            onClick={() => router.push('/assess/sort')}
            className="mt-2 text-amber-700 underline text-sm hover:text-amber-900"
          >
            Go back and add more
          </button>
        </div>
      )}

      {/* Value Selector */}
      {hasEnoughValues && (
        <>
          <ValueSelector
            values={veryImportantValues}
            selected={top5}
            onToggle={toggleTop5}
            maxSelections={maxAllowed}
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
              {top5.length < minRequired
                ? `Select at least ${minRequired} values`
                : `Continue with ${top5.length} values`}
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
