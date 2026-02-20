'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import MomentCard from '@/components/MomentCard';
import { Moment } from '@/types';
import { getMoments, updateMoment } from '@/lib/storage';
import { formatMonthYear, getCurrentMonth } from '@/lib/utils';

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const month = searchParams.get('month') || getCurrentMonth();

  const [moments, setMoments] = useState<Moment[]>([]);
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setMoments(getMoments(month).slice().reverse());
  }, [month]);

  const handleToggleInclude = (id: string, included: boolean) => {
    updateMoment(id, { includeInFloem: included });
    setMoments((prev) =>
      prev.map((m) => (m.id === id ? { ...m, includeInFloem: included } : m))
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const includedCount = moments.filter((m) => m.includeInFloem).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            &larr; Back
          </button>
          <h1 className="font-medium text-gray-800">Review Moments</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Month and count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg text-gray-700">
            {formatMonthYear(month)}
          </h2>
          <span className="text-sm text-gray-500">
            {includedCount} of {moments.length} included
          </span>
        </div>

        {/* Instructions */}
        <p className="text-sm text-gray-500 mb-6 font-serif italic">
          Toggle the checkbox to include or exclude moments from your Floem.
          Tap a moment to expand it.
        </p>

        {/* Moments list */}
        <div className="space-y-3">
          {moments.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {expandedId === moment.id ? (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400">
                          {new Date(moment.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                        {moment.selfNoticed && (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                            Self-noticed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 italic mb-3">
                        Prompt: {moment.prompt}
                      </p>
                    </div>
                    <label className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={moment.includeInFloem}
                        onChange={(e) =>
                          handleToggleInclude(moment.id, e.target.checked)
                        }
                        className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
                      />
                    </label>
                  </div>

                  <p className="text-gray-700 font-serif leading-relaxed whitespace-pre-line mb-4">
                    {moment.text}
                  </p>

                  <button
                    onClick={() => setExpandedId(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Collapse
                  </button>
                </div>
              ) : (
                <MomentCard
                  moment={moment}
                  onClick={() => setExpandedId(moment.id)}
                  showToggle
                  onToggleInclude={(included) =>
                    handleToggleInclude(moment.id, included)
                  }
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {moments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-serif italic">
              No moments to review yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
