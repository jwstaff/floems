'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BreathingCircleProps {
  duration: number; // in seconds
  onComplete: () => void;
}

export default function BreathingCircle({ duration, onComplete }: BreathingCircleProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  // Breathing animation - 4 seconds in, 4 seconds out
  const breatheDuration = 4;

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative flex items-center justify-center">
        {/* Outer breathing ring */}
        <motion.div
          className="absolute w-48 h-48 rounded-full border-2 border-gray-300"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: breatheDuration * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Middle breathing ring */}
        <motion.div
          className="absolute w-36 h-36 rounded-full border border-gray-400"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: breatheDuration * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />

        {/* Inner circle with countdown */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: breatheDuration * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-3xl font-light text-gray-700">
            {timeLeft}
          </span>
        </motion.div>
      </div>

      <motion.p
        className="mt-8 text-gray-500 text-center font-serif italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Take {timeLeft} seconds to notice...
      </motion.p>

      <motion.p
        className="mt-2 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Breathe in... breathe out...
      </motion.p>
    </div>
  );
}
