'use client';

import { CompilationStep } from '@/types';

interface ProgressBarProps {
  currentStep: CompilationStep;
}

const steps: { id: CompilationStep; label: string }[] = [
  { id: 'selection', label: 'Select' },
  { id: 'arrangement', label: 'Arrange' },
  { id: 'theme', label: 'Theme' },
  { id: 'scenes', label: 'Scenes' },
  { id: 'preview', label: 'Preview' },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-between px-2">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isComplete ? 'bg-gray-800 text-white' : ''}
                  ${isCurrent ? 'bg-gray-800 text-white ring-2 ring-offset-2 ring-gray-400' : ''}
                  ${!isComplete && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isCurrent ? 'text-gray-800 font-medium' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 ${
                  index < currentIndex ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
