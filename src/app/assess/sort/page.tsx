'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CardDeck from '@/components/CardDeck';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';
import type { SortCategory } from '@/lib/types';

export default function SortPage() {
  const router = useRouter();
  const {
    shuffledValueIds,
    currentCardIndex,
    sortValue,
    sessionId,
  } = useAssessmentStore();

  // Redirect to home if no session
  useEffect(() => {
    if (!sessionId || shuffledValueIds.length === 0) {
      router.replace('/');
    }
  }, [sessionId, shuffledValueIds, router]);

  // Convert IDs to Value objects
  const values = useMemo(() => {
    return shuffledValueIds
      .map((id) => VALUES_BY_ID[id])
      .filter(Boolean);
  }, [shuffledValueIds]);

  // Check if sorting is complete
  useEffect(() => {
    if (currentCardIndex >= values.length && values.length > 0) {
      // All cards sorted, move to narrow step
      router.push('/assess/narrow');
    }
  }, [currentCardIndex, values.length, router]);

  const handleSwipe = (valueId: string, category: SortCategory) => {
    sortValue(valueId, category);
  };

  if (!sessionId || values.length === 0) {
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
      className="flex flex-col items-center"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sort Your Values
        </h1>
        <p className="text-gray-500">
          How important is each value to you?
        </p>
      </div>

      <CardDeck
        values={values}
        currentIndex={currentCardIndex}
        onSwipe={handleSwipe}
      />
    </motion.div>
  );
}
