'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STEPS = [
  { path: '/assess/sort', label: 'Sort', step: 1 },
  { path: '/assess/narrow', label: 'Narrow', step: 2 },
  { path: '/assess/rank', label: 'Rank', step: 3 },
  { path: '/assess/define', label: 'Define', step: 4 },
  { path: '/assess/review', label: 'Review', step: 5 },
];

export default function AssessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Find current step
  const currentStep = STEPS.find((s) => pathname.startsWith(s.path))?.step ?? 1;
  const progress = (currentStep / STEPS.length) * 100;

  // Warn before leaving during assessment
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header with progress */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step) => (
              <div
                key={step.path}
                className={`flex items-center gap-2 text-sm ${
                  step.step === currentStep
                    ? 'text-indigo-600 font-medium'
                    : step.step < currentStep
                    ? 'text-gray-400'
                    : 'text-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.step === currentStep
                      ? 'bg-indigo-600 text-white'
                      : step.step < currentStep
                      ? 'bg-gray-300 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.step < currentStep ? '✓' : step.step}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
