'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moment, Theme } from '@/types';
import { formatDate } from '@/lib/utils';

interface FlipBookProps {
  moments: Moment[];
  theme: Theme;
  autoPlay?: boolean;
}

export default function FlipBook({ moments, theme, autoPlay = true }: FlipBookProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const totalPages = moments.length;

  // Auto-advance pages
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalPages - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800); // 0.8 seconds per page

    return () => clearInterval(timer);
  }, [isPlaying, totalPages]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (currentIndex >= totalPages - 1) {
      handleRestart();
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentIndex, totalPages, handleRestart]);

  const currentMoment = moments[currentIndex];

  return (
    <div className="flex flex-col items-center">
      {/* Flip book container */}
      <div
        className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: theme.colors.background,
          fontFamily: theme.font,
          perspective: '1000px',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="absolute inset-0 flex flex-col justify-center p-8"
            style={{
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden',
            }}
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
              className="leading-relaxed whitespace-pre-line text-center"
              style={{
                color: theme.colors.text,
                fontSize: theme.fontSize.poem,
              }}
            >
              {currentMoment.text}
            </p>

            {/* Date */}
            <p
              className="text-xs mt-8 text-center"
              style={{ color: theme.colors.scene }}
            >
              {formatDate(currentMoment.date)}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Page edge effect */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2"
          style={{
            background: `linear-gradient(to left, ${theme.colors.accent}, transparent)`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleRestart}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="Restart"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          onClick={handleTogglePlay}
          className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <span className="text-sm text-gray-500 min-w-[60px] text-center">
          {currentIndex + 1} / {totalPages}
        </span>
      </div>
    </div>
  );
}
