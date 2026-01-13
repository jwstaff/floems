// Core data types for Floems

export interface Moment {
  id: string;
  date: string; // ISO timestamp
  prompt: string;
  text: string;
  location?: string;
  mood?: string;
  selfNoticed: boolean;
  includeInFloem: boolean;
}

export interface MomentStats {
  totalCaptured: number;
  selfNoticed: number;
  prompted: number;
  skipped: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    scene: string;
  };
  font: string;
  fontSize: {
    poem: string;
    scene: string;
    date: string;
  };
}

export interface Floem {
  id: string;
  month: string; // YYYY-MM format
  title: string;
  moments: Moment[];
  theme: Theme;
  stats: {
    totalMoments: number;
    daysActive: number;
    selfNoticed: number;
  };
  createdAt: string;
  completedAt: string;
}

export interface MonthData {
  userId: string;
  currentMonth: string; // YYYY-MM
  moments: Moment[];
  stats: MomentStats;
}

export interface CheckIn {
  day: number;
  title: string;
  message: string;
}

export type CompilationStep = 'selection' | 'arrangement' | 'theme' | 'scenes' | 'preview';
