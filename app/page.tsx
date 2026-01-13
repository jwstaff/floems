'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Calendar from '@/components/Calendar';
import MomentCard from '@/components/MomentCard';
import { Moment } from '@/types';
import { getMomentsForCurrentMonth, getStats } from '@/lib/storage';
import { getCheckIn } from '@/lib/prompts';
import {
  formatMonthYear,
  getCurrentMonth,
  getDayOfMonth,
  getDaysRemaining,
} from '@/lib/utils';

export default function Home() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [stats, setStats] = useState({ totalCaptured: 0, selfNoticed: 0, prompted: 0, skipped: 0 });
  const [mounted, setMounted] = useState(false);

  const currentMonth = getCurrentMonth();
  const dayOfMonth = getDayOfMonth();
  const daysRemaining = getDaysRemaining();
  const checkIn = getCheckIn(dayOfMonth);

  useEffect(() => {
    setMounted(true);
    setMoments(getMomentsForCurrentMonth());
    setStats(getStats());
  }, []);

  // Don't render until mounted (avoid hydration mismatch with localStorage)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const canCreateFloem = dayOfMonth >= 28 || moments.length >= 8;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-serif text-gray-800">Floems</h1>
          <p className="text-gray-500 text-sm mt-1">Flip book poems</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Month header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-700">
            {formatMonthYear(currentMonth)}
          </h2>
          <span className="text-sm text-gray-400">
            {daysRemaining} days remaining
          </span>
        </div>

        {/* Check-in message */}
        {checkIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-100 rounded-xl p-4"
          >
            <h3 className="font-medium text-amber-800 mb-2">{checkIn.title}</h3>
            <p className="text-amber-700 text-sm font-serif italic leading-relaxed">
              {checkIn.message.replace('{count}', String(moments.length))}
            </p>
          </motion.div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-light text-gray-800">{moments.length}</div>
            <div className="text-xs text-gray-400 mt-1">Captured</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-light text-amber-600">
              {moments.filter((m) => m.selfNoticed).length}
            </div>
            <div className="text-xs text-gray-400 mt-1">Self-noticed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-light text-gray-800">{stats.skipped}</div>
            <div className="text-xs text-gray-400 mt-1">Skipped</div>
          </div>
        </div>

        {/* Calendar */}
        <Calendar moments={moments} />

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href="/capture"
            className="flex-1 py-3 bg-gray-800 text-white rounded-full text-center font-medium hover:bg-gray-700 transition-colors"
          >
            Capture a moment
          </Link>

          {moments.length > 0 && (
            <Link
              href="/review"
              className="py-3 px-6 bg-white border border-gray-200 text-gray-700 rounded-full text-center font-medium hover:bg-gray-50 transition-colors"
            >
              Review
            </Link>
          )}
        </div>

        {/* Create Floem button (when ready) */}
        {canCreateFloem && moments.length >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link
              href="/create"
              className="block w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl text-center font-medium hover:from-gray-600 hover:to-gray-800 transition-all shadow-lg"
            >
              Create your {formatMonthYear(currentMonth).split(' ')[0]} Floem
            </Link>
          </motion.div>
        )}

        {/* Recent moments */}
        {moments.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Recent moments</h3>
            <div className="space-y-3">
              {moments
                .slice()
                .reverse()
                .slice(0, 3)
                .map((moment) => (
                  <MomentCard key={moment.id} moment={moment} />
                ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {moments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-serif italic mb-4">
              No moments captured yet this month.
            </p>
            <p className="text-gray-500 text-sm">
              Tap "Capture a moment" to begin noticing.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
