import { Theme } from '@/types';

export const themes: Theme[] = [
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: "Ah, the minimalist. Letting the words do the heavy lifting. Very sensible.",
    colors: {
      background: '#FEFEFE',
      text: '#1A1A1A',
      accent: '#E8E8E8',
      scene: '#888888'
    },
    font: 'Georgia, serif',
    fontSize: {
      poem: '18px',
      scene: '12px',
      date: '11px'
    }
  },
  {
    id: 'dark-poetry',
    name: 'Dark Poetry',
    description: "The dark theme—how wonderfully brooding. Your month was either quite serious or you're just drawn to the aesthetic. Either way, I approve.",
    colors: {
      background: '#1A1A1A',
      text: '#E8E8E8',
      accent: '#404040',
      scene: '#999999'
    },
    font: '"Crimson Text", serif',
    fontSize: {
      poem: '18px',
      scene: '12px',
      date: '11px'
    }
  },
  {
    id: 'winter-pale',
    name: 'Winter Pale',
    description: "Winter tones. Appropriate, one supposes, depending on where you are in the world. There's something about pale blues and grays that suits contemplation, doesn't it?",
    colors: {
      background: '#F0F4F8',
      text: '#2D3748',
      accent: '#CBD5E0',
      scene: '#718096'
    },
    font: 'Spectral, serif',
    fontSize: {
      poem: '18px',
      scene: '12px',
      date: '11px'
    }
  }
];

export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id);
}

export function getDefaultTheme(): Theme {
  return themes[0];
}
