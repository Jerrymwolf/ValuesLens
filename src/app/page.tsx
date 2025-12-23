'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { ALL_VALUES } from '@/lib/data/values';
import { shuffleArray } from '@/lib/utils/shuffle';
import { generateSlug } from '@/lib/utils/slugs';

export default function Home() {
  const router = useRouter();
  const { initSession, setConsent: setStoreConsent } = useAssessmentStore();
  const [consent, setConsent] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);

    // Generate session ID and shuffle values
    const sessionId = generateSlug();
    const shuffledIds = shuffleArray(ALL_VALUES.map(v => v.id));

    // Initialize session in store
    initSession(sessionId, shuffledIds);
    setStoreConsent(consent);

    // Navigate to sort page
    router.push('/assess/sort');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Know Your Values.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Own Your Decisions.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            Most people can&apos;t name their top 3 values. The ones who can make better decisions under pressure.
          </p>

          <div className="text-sm text-gray-500 mb-12">
            7 minutes to clarity
          </div>
        </motion.div>

        {/* Tutorial Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            How it works
          </h3>

          <div className="flex justify-around items-start text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg mb-2">
                ←
              </div>
              <span className="text-sm text-gray-600">Less<br/>Important</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-lg mb-2">
                ↑
              </div>
              <span className="text-sm text-amber-600">Somewhat<br/>Important</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-lg mb-2">
                →
              </div>
              <span className="text-sm text-emerald-600">Very<br/>Important</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            Swipe or use arrow keys to sort 90 values
          </p>
        </motion.div>

        {/* Consent Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-600">
              I consent to my anonymized responses being used for research to improve values-based decision making.
              <span className="text-gray-400 ml-1">(Optional)</span>
            </span>
          </label>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isStarting ? 'Starting...' : 'Discover Your Values'}
          </button>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-400">
          <p>A CultureWright Consulting Product</p>
        </div>
      </div>
    </main>
  );
}
