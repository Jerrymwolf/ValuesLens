'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { ALL_VALUES } from '@/lib/data/values';
import { shuffleArray } from '@/lib/utils/shuffle';
import { generateSlug } from '@/lib/utils/slugs';
import { Check, ArrowRight, Sparkles, FileText, Target, Mic } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const {
    initSession,
    setConsent: setStoreConsent,
    sessionId,
    currentCardIndex,
    shuffledValueIds,
    rankedValues,
    reset,
  } = useAssessmentStore();
  const [consent, setConsent] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Refs for scroll animations
  const howItWorksRef = useRef(null);
  const premiumRef = useRef(null);
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const premiumInView = useInView(premiumRef, { once: true, margin: "-100px" });

  // Check for incomplete session on mount
  useEffect(() => {
    if (sessionId && shuffledValueIds.length > 0) {
      const isIncomplete = currentCardIndex < shuffledValueIds.length || rankedValues.length === 0;
      if (isIncomplete) {
        setShowResumeModal(true);
      }
    }
  }, [sessionId, currentCardIndex, shuffledValueIds.length, rankedValues.length]);

  const getResumeRoute = () => {
    if (currentCardIndex < shuffledValueIds.length) {
      return '/assess/sort';
    }
    if (rankedValues.length === 0) {
      return '/assess/narrow';
    }
    return '/assess/rank';
  };

  const handleResume = () => {
    setShowResumeModal(false);
    router.push(getResumeRoute());
  };

  const handleStartFresh = () => {
    reset();
    setShowResumeModal(false);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-2xl font-bold">
              <span className="text-brand-600">Values</span>
              <span className="text-accent-500">Lens</span>
            </span>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-900 leading-tight mb-6"
            >
              See Your Values Clearly.
              <br />
              <span className="text-brand-600">
                Live Them Boldly.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Join 10,000+ people who discovered their core values and transformed how they make decisions.
            </motion.p>

            <motion.div variants={itemVariants} className="mb-4">
              <button
                onClick={handleStart}
                disabled={isStarting}
                className="w-full sm:w-auto px-12 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                {isStarting ? 'Starting...' : 'Start Free Assessment'}
              </button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-500"
            >
              7 minutes &bull; No account required &bull; 100% free
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-brand-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Three simple steps to clarity</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Sort",
                description: "Swipe through 90 values and rate their importance to you"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Rank",
                description: "Pick your top 5 values and put them in order"
              },
              {
                icon: <Mic className="w-8 h-8" />,
                title: "Define",
                description: "Make them yours with AI-powered personal definitions"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center h-full">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-brand-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Teaser Section */}
      <section ref={premiumRef} className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={premiumInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-brand-50 via-white to-accent-50 rounded-3xl p-8 md:p-12 border border-brand-100 shadow-lg"
          >
            <div className="md:flex md:items-center md:gap-12">
              {/* PDF Mockup */}
              <div className="md:w-1/3 mb-8 md:mb-0">
                <div className="bg-white rounded-xl shadow-lg p-6 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="aspect-[3/4] bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-gray-600">Your 2026</p>
                    <p className="text-lg font-bold text-brand-900">Values Report</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="md:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-900">
                    Your 2026 Values Report
                  </h2>
                  <span className="bg-accent-400 text-brand-900 px-4 py-1 rounded-full text-sm font-bold">
                    $12
                  </span>
                </div>

                <p className="text-gray-600 mb-6 text-lg">
                  Start the year with complete clarity about who you are and how to live your values every day.
                </p>

                <ul className="space-y-3 mb-6">
                  {[
                    "All 5 values with deep definitions",
                    "Personal decision-making framework",
                    "Printable values card for your desk",
                    "Beautiful PDF keepsake"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-accent-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-500 italic">
                  Available after completing your free assessment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-brand-900 text-center mb-10">What People Say</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Finally understood why I kept making the same choices. Game-changer for my career.",
                author: "Sarah M."
              },
              {
                quote: "The AI definitions captured exactly what I was trying to say. Shared with my whole team.",
                author: "James T."
              },
              {
                quote: "7 minutes that gave me clarity I've been searching for for years.",
                author: "Priya K."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="text-sm text-gray-500 font-medium">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-brand-900 mb-6">
            Ready to discover your values?
          </h2>

          <button
            onClick={handleStart}
            disabled={isStarting}
            className="w-full sm:w-auto px-12 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mb-6"
          >
            {isStarting ? 'Starting...' : 'Start Your Free Assessment'}
          </button>

          {/* Consent Toggle */}
          <label className="flex items-start gap-3 cursor-pointer justify-center max-w-md mx-auto">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-600 text-left">
              I consent to my anonymized responses being used for research to improve values-based decision making.
              <span className="text-gray-400 ml-1">(Optional)</span>
            </span>
          </label>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            <span className="font-semibold">
              <span className="text-brand-600">Values</span>
              <span className="text-accent-500">Lens</span>
            </span>
            {' '}by CultureWright Consulting
          </p>
        </div>
      </footer>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <h2 className="text-xl font-bold text-brand-900 mb-2">
                Welcome back!
              </h2>
              <p className="text-gray-600 mb-6">
                You have an assessment in progress ({Math.round((currentCardIndex / shuffledValueIds.length) * 100) || 0}% complete). Would you like to continue?
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleResume}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full transition-all"
                >
                  Continue where I left off
                </button>
                <button
                  onClick={handleStartFresh}
                  className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Start fresh
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
