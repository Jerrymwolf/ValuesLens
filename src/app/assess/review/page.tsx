'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DefinitionEditor from '@/components/DefinitionEditor';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';
import { getFallbackTagline } from '@/lib/data/fallbackTaglines';

export default function ReviewPage() {
  const router = useRouter();
  const {
    sessionId,
    rankedValues,
    definitions,
    sortedValues,
    transcript,
    updateDefinition,
    setDefinitions,
  } = useAssessmentStore();

  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

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

  // If no definitions yet, generate fallbacks
  useEffect(() => {
    if (rankedValues.length > 0 && Object.keys(definitions).length === 0) {
      const fallbacks: Record<string, { tagline: string; definition: string; userEdited: boolean }> = {};
      for (const id of rankedValues.slice(0, 3)) {
        const value = VALUES_BY_ID[id];
        if (value) {
          fallbacks[id] = {
            tagline: getFallbackTagline(value.name),
            definition: `${value.name} represents ${value.cardText.toLowerCase()}. This value guides how you approach decisions and relationships.`,
            userEdited: false,
          };
        }
      }
      setDefinitions(fallbacks);
    }
  }, [rankedValues, definitions, setDefinitions]);

  // Get top 3 values with definitions
  const top3 = useMemo(() => {
    return rankedValues.slice(0, 3).map((id, index) => ({
      value: VALUES_BY_ID[id],
      definition: definitions[id] || {
        tagline: getFallbackTagline(VALUES_BY_ID[id]?.name || ''),
        userEdited: false,
      },
      rank: index + 1,
    })).filter((item) => item.value);
  }, [rankedValues, definitions]);

  const handleUpdate = useCallback((valueId: string, tagline: string, definition?: string) => {
    updateDefinition(valueId, tagline, definition);
  }, [updateDefinition]);

  const handleRegenerate = useCallback(async (valueId: string) => {
    setRegeneratingId(valueId);

    try {
      const response = await fetch('/api/ai/generate-definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          rankedValues: [valueId], // Only regenerate this one
          transcript: rankedValues[0] === valueId ? transcript : '', // Include transcript only for #1
          sortedValues,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.definitions && data.definitions[valueId]) {
          updateDefinition(
            valueId,
            data.definitions[valueId].tagline,
            data.definitions[valueId].definition
          );
        }
      }
    } catch (error) {
      console.error('Regeneration error:', error);
    } finally {
      setRegeneratingId(null);
    }
  }, [sessionId, rankedValues, transcript, sortedValues, updateDefinition]);

  const handleContinue = () => {
    router.push('/assess/share');
  };

  if (!sessionId || top3.length === 0) {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your Values Defined
        </h1>
        <p className="text-gray-600">
          Review and personalize your value definitions
        </p>
      </div>

      {/* Definition cards */}
      <div className="space-y-6 mb-8">
        {top3.map(({ value, definition, rank }) => (
          <DefinitionEditor
            key={value.id}
            value={value}
            definition={definition}
            rank={rank}
            onUpdate={(tagline, def) => handleUpdate(value.id, tagline, def)}
            onRegenerate={() => handleRegenerate(value.id)}
            isRegenerating={regeneratingId === value.id}
          />
        ))}
      </div>

      {/* Premium teaser */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 mb-8 border border-purple-100">
        <div className="flex items-start gap-4">
          <span className="text-2xl">✨</span>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Unlock Deep Insights
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Get domain analysis, value tensions, personalized decision frameworks, and definitions for all 5 values.
            </p>
            <button
              disabled
              className="text-sm text-purple-600 font-medium hover:text-purple-700 disabled:opacity-50"
            >
              Coming soon →
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Create My Values Card
        </button>
      </motion.div>

      {/* Edit hint */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Tap the pencil icon to edit any definition
      </p>
    </motion.div>
  );
}
