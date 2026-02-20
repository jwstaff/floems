// Utility functions for Floems

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getDayOfMonth(): number {
  return new Date().getDate();
}

export function getDaysInMonth(month?: string): number {
  const date = month ? new Date(month + '-01') : new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getDaysRemaining(): number {
  const today = getDayOfMonth();
  const totalDays = getDaysInMonth();
  return totalDays - today;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateLong(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMonthYear(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function getMonthName(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
}

// Get array of days in month with their dates
export function getMonthDays(month?: string): { day: number; date: string }[] {
  const targetMonth = month || getCurrentMonth();
  const [year, monthNum] = targetMonth.split('-').map(Number);
  const daysInMonth = getDaysInMonth(targetMonth);

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, monthNum - 1, day);
    return {
      day,
      date: date.toISOString().split('T')[0],
    };
  });
}

// Check if a date string is today
export function isToday(isoString: string): boolean {
  const date = new Date(isoString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Get character count guidance
export function getCharacterGuidance(length: number): string {
  if (length < 50) return 'A few words is enough';
  if (length < 150) return 'Beautiful. Keep going if you want';
  return 'Perfect length. Feel free to stop here.';
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Parse poem text into lines for display
export function parsePoem(text: string): string[] {
  return text.split('\n').filter(line => line.trim());
}

// Get adjacent months
export function getPrevMonth(month: string): string {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 2); // monthNum-1 is current, monthNum-2 is prev
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getNextMonth(month: string): string {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum); // monthNum-1 is current, monthNum is next
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Shuffle array (for randomizing prompts)
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
