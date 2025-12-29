'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RotateCcw, PartyPopper } from 'lucide-react';
import ShareInterface from '@/components/ShareInterface';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';
import { getFallbackTagline } from '@/lib/data/fallbackTaglines';
import type { ValueWithDefinition } from '@/components/ValuesCard';

export default function SharePage() {
  const router = useRouter();
  const {
    sessionId,
    rankedValues,
    definitions,
    shareSlug,
    setShareSlug,
    reset,
  } = useAssessmentStore();

  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Create profile on mount if not already created
  useEffect(() => {
    if (shareSlug || !sessionId || rankedValues.length === 0) return;

    createProfile();
  }, [sessionId, rankedValues, shareSlug]);

  const createProfile = async () => {
    setIsCreatingProfile(true);
    setError(null);

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          rankedValues,
          definitions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const data = await response.json();
      setShareSlug(data.slug);
    } catch (err) {
      console.error('Profile creation error:', err);
      setError('Could not create shareable profile');
    } finally {
      setIsCreatingProfile(false);
    }
  };

  // Convert to ValueWithDefinition format
  const valuesWithDefinitions: ValueWithDefinition[] = useMemo(() => {
    return rankedValues.slice(0, 3).map((id) => {
      const value = VALUES_BY_ID[id];
      const def = definitions[id];
      return {
        value: value!,
        tagline: def?.tagline || getFallbackTagline(value?.name || ''),
        definition: def?.definition,
      };
    }).filter((v) => v.value);
  }, [rankedValues, definitions]);

  const shareUrl = shareSlug
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${shareSlug}`
    : undefined;

  const handleStartOver = () => {
    reset();
    router.push('/');
  };

  if (!sessionId || valuesWithDefinitions.length === 0) {
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
      {/* Celebration header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full mb-4"
        >
          <PartyPopper className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-brand-900 mb-2">
          Your Values Card is Ready!
        </h1>
        <p className="text-gray-600">
          Share your values with the world
        </p>
      </div>

      {/* Profile creation status */}
      {isCreatingProfile && (
        <div className="text-center mb-6 text-gray-500 text-sm">
          Creating your shareable profile...
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm text-center">
          {error}
          <button
            onClick={createProfile}
            className="block mx-auto mt-2 text-amber-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Share interface */}
      <ShareInterface values={valuesWithDefinitions} shareUrl={shareUrl} />

      {/* Start over button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleStartOver}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <RotateCcw size={16} />
          Start a new assessment
        </button>
      </div>

      {/* Stats teaser */}
      <div className="mt-8 p-4 bg-brand-50 rounded-xl text-center border border-brand-100">
        <p className="text-sm text-brand-700">
          Join thousands who have discovered their core values
        </p>
      </div>
    </motion.div>
  );
}
