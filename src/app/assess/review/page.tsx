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
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
      const fallbacks: Record<string, { tagline: string; definition: string; behavioralAnchors: string[]; userEdited: boolean }> = {};
      for (const id of rankedValues.slice(0, 3)) {
        const value = VALUES_BY_ID[id];
        if (value) {
          fallbacks[id] = {
            tagline: getFallbackTagline(value.name),
            definition: `${value.name} represents ${value.cardText.toLowerCase()}. This value guides how you approach decisions and relationships. When you honor this value, you feel aligned with your authentic self.`,
            behavioralAnchors: [
              `When making important decisions, ask: Does this align with ${value.name.toLowerCase()}?`,
              `In moments of doubt, ask: What would honoring ${value.name.toLowerCase()} look like here?`,
              `Before committing, ask: Will this choice reflect my commitment to ${value.name.toLowerCase()}?`,
            ],
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

  const handleUpdate = useCallback((
    valueId: string,
    tagline: string,
    definition?: string,
    behavioralAnchors?: string[]
  ) => {
    updateDefinition(valueId, tagline, definition, behavioralAnchors);
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
            data.definitions[valueId].definition,
            data.definitions[valueId].behavioralAnchors
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

  const handlePurchase = async () => {
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          rankedValues,
          definitions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsCheckingOut(false);
    }
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
        <h1 className="text-2xl font-bold text-brand-900 mb-2">
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

      {/* Premium Upsell - Key Conversion Point */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-brand-50 via-white to-accent-50 rounded-2xl p-6 mb-8 border border-brand-200 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="font-bold text-brand-900">
              Your 2026 Values Report
            </h3>
            <p className="text-sm text-gray-500">One-time purchase</p>
          </div>
          <span className="ml-auto text-2xl font-bold text-brand-700">$12</span>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Start the new year with a beautiful, printable report that captures your core values and helps you make aligned decisions.
        </p>

        <ul className="space-y-2 mb-5">
          {[
            'Full definitions for all 5 values',
            'Personal decision framework',
            'Beautifully designed PDF report',
            'Printable values wallet card',
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                <span className="text-accent-600 text-xs">✓</span>
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={handlePurchase}
          disabled={isCheckingOut}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isCheckingOut ? 'Redirecting...' : 'Get My 2026 Report'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Secure checkout · Instant PDF download
        </p>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Create My Values Card
        </button>
        <p className="text-center text-sm text-gray-400 mt-3">
          Free — share your values with the world
        </p>
      </motion.div>

    </motion.div>
  );
}
