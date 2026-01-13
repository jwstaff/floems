'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BreathingCircle from '@/components/BreathingCircle';
import { getPromptForDay, getSkipResponse } from '@/lib/prompts';
import { saveMoment, updateStats } from '@/lib/storage';
import { getDayOfMonth, getCharacterGuidance } from '@/lib/utils';

type CaptureState = 'prompt' | 'breathing' | 'writing' | 'skipped' | 'saved';

export default function CapturePage() {
  const router = useRouter();
  const [state, setState] = useState<CaptureState>('prompt');
  const [prompt] = useState(() => getPromptForDay(getDayOfMonth()));
  const [text, setText] = useState('');
  const [selfNoticed, setSelfNoticed] = useState(false);
  const [skipMessage, setSkipMessage] = useState('');

  const maxChars = 280;

  const handleStartBreathing = () => {
    setState('breathing');
  };

  const handleBreathingComplete = useCallback(() => {
    setState('writing');
  }, []);

  const handleSkip = () => {
    setSkipMessage(getSkipResponse());
    updateStats('skip');
    setState('skipped');
  };

  const handleCapture = () => {
    if (text.trim().length === 0) return;

    saveMoment({
      date: new Date().toISOString(),
      prompt: selfNoticed ? 'Self-noticed moment' : prompt,
      text: text.trim(),
      selfNoticed,
      includeInFloem: true,
    });

    setState('saved');
  };

  const handleDone = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <button
          onClick={() => router.push('/')}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          &larr; Back
        </button>
        {state === 'writing' && (
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            Skip for now
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Prompt state */}
          {state === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl font-serif text-gray-700 leading-relaxed mb-8">
                {prompt}
              </p>

              <button
                onClick={handleStartBreathing}
                className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium"
              >
                Begin noticing
              </button>

              <div className="mt-6">
                <label className="flex items-center justify-center gap-2 text-gray-500 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selfNoticed}
                    onChange={(e) => setSelfNoticed(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  I noticed this myself
                </label>
              </div>
            </motion.div>
          )}

          {/* Breathing state */}
          {state === 'breathing' && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BreathingCircle duration={30} onComplete={handleBreathingComplete} />
            </motion.div>
          )}

          {/* Writing state */}
          {state === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <p className="text-sm text-gray-500 mb-4 font-serif italic text-center">
                {selfNoticed ? 'What did you notice?' : prompt}
              </p>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, maxChars))}
                placeholder="Write your moment..."
                autoFocus
                className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 font-serif text-lg leading-relaxed"
              />

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-400">
                  {getCharacterGuidance(text.length)}
                </span>
                <span className={`text-sm ${text.length > maxChars - 30 ? 'text-amber-500' : 'text-gray-400'}`}>
                  {text.length}/{maxChars}
                </span>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleCapture}
                  disabled={text.trim().length === 0}
                  className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Capture moment
                </button>
              </div>
            </motion.div>
          )}

          {/* Skipped state */}
          {state === 'skipped' && (
            <motion.div
              key="skipped"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-xl font-serif text-gray-600 leading-relaxed mb-8 italic">
                {skipMessage}
              </p>

              <button
                onClick={handleDone}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-medium"
              >
                Return home
              </button>
            </motion.div>
          )}

          {/* Saved state */}
          {state === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <p className="text-xl font-serif text-gray-700 mb-2">
                Moment captured
              </p>
              <p className="text-gray-500 mb-8">
                {selfNoticed ? "Splendid. You're noticing on your own now." : "Beautifully observed."}
              </p>

              <button
                onClick={handleDone}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-medium"
              >
                Return home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
