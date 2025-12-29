'use client';

import { AnimatePresence } from 'framer-motion';
import SwipeableValueCard from './SwipeableValueCard';
import type { Value, SortCategory } from '@/lib/types';

interface CardDeckProps {
  values: Value[];
  currentIndex: number;
  onSwipe: (valueId: string, category: SortCategory) => void;
}

export default function CardDeck({ values, currentIndex, onSwipe }: CardDeckProps) {
  // Only render top 3 cards for performance
  const visibleCards = values.slice(currentIndex, currentIndex + 3);
  const progress = ((currentIndex) / values.length) * 100;
  const remaining = values.length - currentIndex;

  const handleSwipe = (category: SortCategory) => {
    const currentValue = values[currentIndex];
    if (currentValue) {
      onSwipe(currentValue.id, category);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Progress Bar */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{currentIndex} sorted</span>
          <span>{remaining} remaining</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-sm h-[320px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((value, index) => (
            <SwipeableValueCard
              key={value.id}
              value={value}
              onSwipe={handleSwipe}
              isTop={index === 0}
              index={index}
            />
          ))}
        </AnimatePresence>

        {/* Empty state when all cards sorted */}
        {visibleCards.length === 0 && (
          <div className="text-center text-gray-500">
            <p className="text-xl font-medium">All values sorted!</p>
            <p className="text-sm mt-2">Moving to the next step...</p>
          </div>
        )}
      </div>

      {/* Swipe Instructions */}
      <div className="mt-8 flex gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            ←
          </div>
          <span>Less</span>
        </div>
        <div className="flex items-center gap-2 text-amber-500">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            ↑
          </div>
          <span>Somewhat</span>
        </div>
        <div className="flex items-center gap-2 text-accent-600">
          <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center">
            →
          </div>
          <span>Very</span>
        </div>
      </div>
    </div>
  );
}
