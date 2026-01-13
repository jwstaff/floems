'use client';

import { motion } from 'framer-motion';
import { Moment } from '@/types';
import { formatDate, truncate } from '@/lib/utils';

interface MomentCardProps {
  moment: Moment;
  onClick?: () => void;
  showToggle?: boolean;
  onToggleInclude?: (included: boolean) => void;
}

export default function MomentCard({
  moment,
  onClick,
  showToggle = false,
  onToggleInclude,
}: MomentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-lg p-4 shadow-sm border border-gray-100
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Date and badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400">{formatDate(moment.date)}</span>
            {moment.selfNoticed && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                Self-noticed
              </span>
            )}
          </div>

          {/* Poem text */}
          <p className="text-gray-700 font-serif leading-relaxed whitespace-pre-line">
            {onClick ? truncate(moment.text, 100) : moment.text}
          </p>

          {/* Scene if present */}
          {moment.location && (
            <p className="text-xs text-gray-400 mt-2 italic">
              {moment.location}
            </p>
          )}
        </div>

        {/* Include toggle */}
        {showToggle && onToggleInclude && (
          <label className="flex-shrink-0">
            <input
              type="checkbox"
              checked={moment.includeInFloem}
              onChange={(e) => {
                e.stopPropagation();
                onToggleInclude(e.target.checked);
              }}
              className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
            />
          </label>
        )}
      </div>
    </motion.div>
  );
}
