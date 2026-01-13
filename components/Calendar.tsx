'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moment } from '@/types';
import { getMonthDays, getCurrentMonth, getDayOfMonth } from '@/lib/utils';

interface CalendarProps {
  moments: Moment[];
  month?: string;
}

export default function Calendar({ moments, month }: CalendarProps) {
  const targetMonth = month || getCurrentMonth();
  const days = useMemo(() => getMonthDays(targetMonth), [targetMonth]);
  const today = getDayOfMonth();
  const currentMonth = getCurrentMonth();
  const isCurrentMonth = targetMonth === currentMonth;

  // Create a map of days with moments
  const momentsByDay = useMemo(() => {
    const map = new Map<number, Moment[]>();
    moments.forEach((moment) => {
      const date = new Date(moment.date);
      const day = date.getDate();
      if (!map.has(day)) {
        map.set(day, []);
      }
      map.get(day)!.push(moment);
    });
    return map;
  }, [moments]);

  // Get day of week for first day of month (0 = Sunday)
  const [year, monthNum] = targetMonth.split('-').map(Number);
  const firstDayOfWeek = new Date(year, monthNum - 1, 1).getDay();

  // Day labels
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((label, i) => (
          <div key={i} className="text-center text-xs text-gray-400 font-medium py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map(({ day }) => {
          const dayMoments = momentsByDay.get(day) || [];
          const hasMoments = dayMoments.length > 0;
          const hasSelfNoticed = dayMoments.some((m) => m.selfNoticed);
          const isToday = isCurrentMonth && day === today;
          const isPast = isCurrentMonth && day < today;
          const isFuture = isCurrentMonth && day > today;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: day * 0.02 }}
              className={`
                aspect-square flex items-center justify-center relative rounded-lg text-sm
                ${isToday ? 'ring-2 ring-gray-400 ring-offset-1' : ''}
                ${isPast && !hasMoments ? 'text-gray-300' : ''}
                ${isFuture ? 'text-gray-300' : ''}
                ${hasMoments ? 'text-gray-700 font-medium' : 'text-gray-500'}
              `}
            >
              {day}

              {/* Moment indicators */}
              {hasMoments && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayMoments.slice(0, 3).map((moment, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        moment.selfNoticed ? 'bg-amber-400' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                  {dayMoments.length > 3 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Prompted</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Self-noticed</span>
        </div>
      </div>
    </div>
  );
}
