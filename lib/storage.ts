'use client';

import { Moment, Floem, MomentStats } from '@/types';

const MOMENTS_KEY = 'floems_moments';
const FLOEMS_KEY = 'floems_completed';
const STATS_KEY = 'floems_stats';

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get current month string (YYYY-MM)
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Moments CRUD operations

export function saveMoment(moment: Omit<Moment, 'id'>): Moment {
  const moments = getMoments();
  const newMoment: Moment = {
    ...moment,
    id: generateId(),
  };
  moments.push(newMoment);
  localStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
  updateStats('capture', moment.selfNoticed);
  return newMoment;
}

export function getMoments(month?: string): Moment[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(MOMENTS_KEY);
  if (!data) return [];

  const moments: Moment[] = JSON.parse(data);

  if (month) {
    return moments.filter(m => m.date.startsWith(month));
  }

  return moments;
}

export function getMomentsForCurrentMonth(): Moment[] {
  return getMoments(getCurrentMonth());
}

export function getMomentById(id: string): Moment | undefined {
  const moments = getMoments();
  return moments.find(m => m.id === id);
}

export function updateMoment(id: string, updates: Partial<Moment>): Moment | null {
  const moments = getMoments();
  const index = moments.findIndex(m => m.id === id);

  if (index === -1) return null;

  moments[index] = { ...moments[index], ...updates };
  localStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
  return moments[index];
}

export function deleteMoment(id: string): boolean {
  const moments = getMoments();
  const filtered = moments.filter(m => m.id !== id);

  if (filtered.length === moments.length) return false;

  localStorage.setItem(MOMENTS_KEY, JSON.stringify(filtered));
  return true;
}

// Floems CRUD operations

export function saveFloem(floem: Omit<Floem, 'id' | 'completedAt'>): Floem {
  const floems = getFloems();
  const newFloem: Floem = {
    ...floem,
    id: `floem_${floem.month}`,
    completedAt: new Date().toISOString(),
  };

  // Replace if exists for this month, otherwise add
  const existingIndex = floems.findIndex(f => f.month === floem.month);
  if (existingIndex >= 0) {
    floems[existingIndex] = newFloem;
  } else {
    floems.push(newFloem);
  }

  localStorage.setItem(FLOEMS_KEY, JSON.stringify(floems));
  return newFloem;
}

export function getFloems(): Floem[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(FLOEMS_KEY);
  if (!data) return [];

  return JSON.parse(data);
}

export function getFloemById(id: string): Floem | undefined {
  const floems = getFloems();
  return floems.find(f => f.id === id);
}

export function getFloemByMonth(month: string): Floem | undefined {
  const floems = getFloems();
  return floems.find(f => f.month === month);
}

// Stats operations

export function getStats(): MomentStats {
  if (typeof window === 'undefined') {
    return { totalCaptured: 0, selfNoticed: 0, prompted: 0, skipped: 0 };
  }

  const data = localStorage.getItem(STATS_KEY);
  if (!data) {
    return { totalCaptured: 0, selfNoticed: 0, prompted: 0, skipped: 0 };
  }

  return JSON.parse(data);
}

export function updateStats(action: 'capture' | 'skip', selfNoticed: boolean = false): void {
  const stats = getStats();

  if (action === 'capture') {
    stats.totalCaptured++;
    if (selfNoticed) {
      stats.selfNoticed++;
    } else {
      stats.prompted++;
    }
  } else if (action === 'skip') {
    stats.skipped++;
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// Export all data for backup
export function exportData(): string {
  const data = {
    moments: getMoments(),
    floems: getFloems(),
    stats: getStats(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

// Import data from backup
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (data.moments) {
      localStorage.setItem(MOMENTS_KEY, JSON.stringify(data.moments));
    }
    if (data.floems) {
      localStorage.setItem(FLOEMS_KEY, JSON.stringify(data.floems));
    }
    if (data.stats) {
      localStorage.setItem(STATS_KEY, JSON.stringify(data.stats));
    }

    return true;
  } catch {
    return false;
  }
}

// Clear all data (for testing)
export function clearAllData(): void {
  localStorage.removeItem(MOMENTS_KEY);
  localStorage.removeItem(FLOEMS_KEY);
  localStorage.removeItem(STATS_KEY);
}
