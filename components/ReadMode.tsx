'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moment, Theme } from '@/types';
import { formatDate } from '@/lib/utils';

interface ReadModeProps {
  moments: Moment[];
  theme: Theme;
}

export default function ReadMode({ moments, theme }: ReadModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalPages = moments.length;

  const goToNext = useCallback(() => {
    if (currentIndex < totalPages - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalPages]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setTouchStart(null);
  };

  const currentMoment = moments[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col items-center">
      {/* Page container */}
      <div
        className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: theme.colors.background,
          fontFamily: theme.font,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col justify-center p-8"
          >
            {/* Scene description */}
            {currentMoment.location && (
              <p
                className="text-xs mb-4"
                style={{ color: theme.colors.scene }}
              >
                {currentMoment.location}
              </p>
            )}

            {/* Poem text */}
            <p
              className="leading-relaxed whitespace-pre-line"
              style={{
                color: theme.colors.text,
                fontSize: theme.fontSize.poem,
              }}
            >
              {currentMoment.text}
            </p>

            {/* Date and page number */}
            <div
              className="flex items-center justify-between mt-8 text-xs"
              style={{ color: theme.colors.scene }}
            >
              <span>{formatDate(currentMoment.date)}</span>
              <span>{currentIndex + 1} / {totalPages}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {totalPages}
        </span>

        <button
          onClick={goToNext}
          disabled={currentIndex === totalPages - 1}
          className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="mt-4 text-xs text-gray-400">
        Use arrow keys or swipe to navigate
      </p>
    </div>
  );
}
