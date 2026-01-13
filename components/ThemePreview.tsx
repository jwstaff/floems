'use client';

import { motion } from 'framer-motion';
import { Theme } from '@/types';

interface ThemePreviewProps {
  theme: Theme;
  selected: boolean;
  onClick: () => void;
}

export default function ThemePreview({ theme, selected, onClick }: ThemePreviewProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full text-left rounded-xl overflow-hidden border-2 transition-colors
        ${selected ? 'border-gray-800 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      {/* Theme preview */}
      <div
        className="p-6 min-h-[140px] flex flex-col justify-center"
        style={{
          backgroundColor: theme.colors.background,
          fontFamily: theme.font,
        }}
      >
        <p
          className="text-xs mb-2"
          style={{ color: theme.colors.scene }}
        >
          morning coffee shop
        </p>
        <p
          className="text-base leading-relaxed"
          style={{
            color: theme.colors.text,
            fontSize: theme.fontSize.poem,
          }}
        >
          steam rising slowly
          <br />
          from the cup between my hands
        </p>
        <p
          className="text-xs mt-3"
          style={{ color: theme.colors.scene }}
        >
          Jan 15
        </p>
      </div>

      {/* Theme info */}
      <div className="bg-white p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">{theme.name}</h3>
          {selected && (
            <span className="text-xs px-2 py-1 bg-gray-800 text-white rounded-full">
              Selected
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
