'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import FlipBook from '@/components/FlipBook';
import ReadMode from '@/components/ReadMode';
import { Floem } from '@/types';
import { getFloemById } from '@/lib/storage';
import { formatMonthYear } from '@/lib/utils';

type ViewMode = 'flip' | 'read';

export default function ViewFloemPage() {
  const router = useRouter();
  const params = useParams();
  const [floem, setFloem] = useState<Floem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('flip');

  useEffect(() => {
    setMounted(true);
    const id = params.id as string;
    const loadedFloem = getFloemById(id);
    setFloem(loadedFloem || null);
  }, [params.id]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!floem) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <p className="text-gray-500 mb-4">Floem not found</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          Return home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            &larr; Home
          </button>
          <h1 className="font-medium text-gray-800">
            {floem.title || formatMonthYear(floem.month)}
          </h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Mode toggle */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setViewMode('flip')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                viewMode === 'flip'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Flip Mode
            </button>
            <button
              onClick={() => setViewMode('read')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                viewMode === 'read'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Read Mode
            </button>
          </div>
        </div>
      </div>

      {/* Floem viewer */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'flip' ? (
            <FlipBook moments={floem.moments} theme={floem.theme} />
          ) : (
            <ReadMode moments={floem.moments} theme={floem.theme} />
          )}
        </motion.div>

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>{floem.moments.length} moments · {floem.stats.daysActive} days · {floem.stats.selfNoticed} self-noticed</p>
          <p className="mt-1">Created {new Date(floem.completedAt).toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  );
}
