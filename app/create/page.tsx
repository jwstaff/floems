'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import ProgressBar from '@/components/ProgressBar';
import ThemePreview from '@/components/ThemePreview';
import { Moment, Theme, CompilationStep } from '@/types';
import { getMoments, saveFloem } from '@/lib/storage';
import { themes, getDefaultTheme } from '@/lib/themes';
import { compilationGuidance, completionMessage } from '@/lib/prompts';
import { formatMonthYear, getCurrentMonth, formatDate } from '@/lib/utils';

function CreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const month = searchParams.get('month') || getCurrentMonth();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CompilationStep>('selection');
  const [allMoments, setAllMoments] = useState<Moment[]>([]);
  const [selectedMoments, setSelectedMoments] = useState<Moment[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(getDefaultTheme());
  const [scenes, setScenes] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
    const moments = getMoments(month);
    setAllMoments(moments);
    setSelectedMoments(moments.filter((m) => m.includeInFloem));
  }, [month]);

  const handleToggleSelect = (moment: Moment) => {
    setSelectedMoments((prev) => {
      const exists = prev.find((m) => m.id === moment.id);
      if (exists) {
        return prev.filter((m) => m.id !== moment.id);
      }
      return [...prev, moment];
    });
  };

  const handleSortChronological = () => {
    setSelectedMoments((prev) =>
      [...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
  };

  const handleSortRandom = () => {
    setSelectedMoments((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const handleSceneChange = (momentId: string, scene: string) => {
    setScenes((prev) => ({ ...prev, [momentId]: scene }));
  };

  const handlePublish = useCallback(() => {
    const momentsWithScenes = selectedMoments.map((m) => ({
      ...m,
      location: scenes[m.id] || m.location,
    }));

    saveFloem({
      month,
      title: formatMonthYear(month),
      moments: momentsWithScenes,
      theme: selectedTheme,
      stats: {
        totalMoments: momentsWithScenes.length,
        daysActive: new Set(momentsWithScenes.map((m) => m.date.split('T')[0])).size,
        selfNoticed: momentsWithScenes.filter((m) => m.selfNoticed).length,
      },
      createdAt: new Date().toISOString(),
    });

    setIsComplete(true);
  }, [selectedMoments, scenes, selectedTheme, month]);

  const getSelectionGuidance = () => {
    const count = selectedMoments.length;
    if (count < 5) return compilationGuidance.selection.tooFew.replace('{count}', String(count));
    if (count > 15) return compilationGuidance.selection.tooMany.replace('{count}', String(count));
    return compilationGuidance.selection.justRight.replace('{count}', String(count));
  };

  const canProceed = () => {
    switch (step) {
      case 'selection':
        return selectedMoments.length >= 5;
      default:
        return true;
    }
  };

  const nextStep = () => {
    const stepOrder: CompilationStep[] = ['selection', 'arrangement', 'theme', 'scenes', 'preview'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: CompilationStep[] = ['selection', 'arrangement', 'theme', 'scenes', 'preview'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-gray-800 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <p className="text-gray-700 font-serif italic leading-relaxed whitespace-pre-line mb-8">
            {completionMessage}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/view/floem_${month}`)}
              className="w-full py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
            >
              View your Floem
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Return home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => (step === 'selection' ? router.push('/') : prevStep())}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              &larr; {step === 'selection' ? 'Cancel' : 'Back'}
            </button>
            <h1 className="font-medium text-gray-800">
              Create {formatMonthYear(month).split(' ')[0]} Floem
            </h1>
            <div className="w-12" />
          </div>
          <ProgressBar currentStep={step} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full">
        <AnimatePresence mode="wait">
          {/* Step 1: Selection */}
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-500 font-serif italic mb-4">
                {getSelectionGuidance()}
              </p>

              <div className="space-y-2">
                {allMoments.map((moment) => {
                  const isSelected = selectedMoments.some((m) => m.id === moment.id);
                  return (
                    <button
                      key={moment.id}
                      onClick={() => handleToggleSelect(moment)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        isSelected
                          ? 'border-gray-800 bg-gray-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                            isSelected ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">{formatDate(moment.date)}</p>
                          <p className="text-gray-700 font-serif line-clamp-2">{moment.text}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Arrangement */}
          {step === 'arrangement' && (
            <motion.div
              key="arrangement"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-500 font-serif italic mb-4">
                {compilationGuidance.arrangement}
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleSortChronological}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Chronological
                </button>
                <button
                  onClick={handleSortRandom}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Surprise me
                </button>
              </div>

              <Reorder.Group
                axis="y"
                values={selectedMoments}
                onReorder={setSelectedMoments}
                className="space-y-2"
              >
                {selectedMoments.map((moment, index) => (
                  <Reorder.Item
                    key={moment.id}
                    value={moment}
                    className="bg-white p-4 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 text-sm font-medium w-6">
                        {index + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-1">{formatDate(moment.date)}</p>
                        <p className="text-gray-700 font-serif line-clamp-2">{moment.text}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </motion.div>
          )}

          {/* Step 3: Theme */}
          {step === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-500 font-serif italic mb-6">
                Choose a visual theme for your Floem.
              </p>

              {selectedTheme && (
                <p className="text-gray-600 font-serif italic mb-6 p-4 bg-gray-100 rounded-lg">
                  {selectedTheme.description}
                </p>
              )}

              <div className="space-y-4">
                {themes.map((theme) => (
                  <ThemePreview
                    key={theme.id}
                    theme={theme}
                    selected={selectedTheme.id === theme.id}
                    onClick={() => setSelectedTheme(theme)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Scenes */}
          {step === 'scenes' && (
            <motion.div
              key="scenes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-500 font-serif italic mb-6">
                {compilationGuidance.scenes}
              </p>

              <div className="space-y-4">
                {selectedMoments.map((moment) => (
                  <div key={moment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 font-serif line-clamp-2 mb-3">{moment.text}</p>
                    <input
                      type="text"
                      value={scenes[moment.id] || ''}
                      onChange={(e) => handleSceneChange(moment.id, e.target.value.slice(0, 30))}
                      placeholder="e.g., morning train platform"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                      maxLength={30}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="mt-4 text-gray-500 text-sm hover:text-gray-700"
              >
                Skip scenes for now →
              </button>
            </motion.div>
          )}

          {/* Step 5: Preview */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-600 font-serif italic mb-6 whitespace-pre-line">
                {compilationGuidance.finalPreview.replace('{count}', String(selectedMoments.length))}
              </p>

              {/* Mini preview */}
              <div
                className="rounded-xl overflow-hidden mb-6"
                style={{
                  backgroundColor: selectedTheme.colors.background,
                  fontFamily: selectedTheme.font,
                }}
              >
                {selectedMoments.slice(0, 3).map((moment) => (
                  <div
                    key={moment.id}
                    className="p-6 border-b"
                    style={{ borderColor: selectedTheme.colors.accent }}
                  >
                    {(scenes[moment.id] || moment.location) && (
                      <p
                        className="text-xs mb-2"
                        style={{ color: selectedTheme.colors.scene }}
                      >
                        {scenes[moment.id] || moment.location}
                      </p>
                    )}
                    <p
                      className="leading-relaxed whitespace-pre-line"
                      style={{
                        color: selectedTheme.colors.text,
                        fontSize: selectedTheme.fontSize.poem,
                      }}
                    >
                      {moment.text}
                    </p>
                    <p
                      className="text-xs mt-3"
                      style={{ color: selectedTheme.colors.scene }}
                    >
                      {formatDate(moment.date)}
                    </p>
                  </div>
                ))}
                {selectedMoments.length > 3 && (
                  <div
                    className="p-4 text-center text-sm"
                    style={{ color: selectedTheme.colors.scene }}
                  >
                    + {selectedMoments.length - 3} more moments
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 mb-4">
                {selectedMoments.length} moments · {selectedTheme.name} theme
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer with navigation */}
      <footer className="bg-white border-t border-gray-100 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step !== 'preview' ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="flex-1 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
            >
              This is my {formatMonthYear(month).split(' ')[0]} →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <CreateContent />
    </Suspense>
  );
}
