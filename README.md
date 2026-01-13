# Floems

A mindfulness and poetry web app for capturing daily moments and compiling them into beautiful, interactive flip-book style digital poetry collections.

## Overview

Floems helps you practice deliberate attention by noticing and documenting brief observations throughout the month. At month's end, curate your moments into a personalized "Floem" (Flip book poem) with themes, arrangement, and scene descriptions.

## Features

- **Daily Capture** - Guided prompts or self-directed observations (max 280 characters)
- **30-Second Breathing Exercise** - Animated mindfulness timer before writing
- **Monthly Calendar View** - Visual indicators for days with captured moments
- **Floem Creation Wizard** - 5-step process: select → arrange → theme → scenes → preview
- **Interactive Flip Book** - 3D page-flip animations with auto-advance
- **Three Visual Themes** - Minimal Light, Dark Poetry, Winter Pale
- **PWA Ready** - Works offline, installable on mobile devices
- **Privacy First** - All data stored locally in browser (no server required)

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Framer Motion (animations)
- Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
cd floems
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
floems/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home dashboard
│   ├── capture/           # Moment capture flow
│   ├── review/            # Review captured moments
│   ├── create/            # Floem creation wizard
│   └── view/[id]/         # View completed Floems
├── components/            # React components
│   ├── BreathingCircle    # Animated breathing timer
│   ├── Calendar           # Monthly calendar view
│   ├── FlipBook           # 3D flip-book viewer
│   └── ...
├── lib/                   # Utilities
│   ├── storage.ts         # localStorage operations
│   ├── prompts.ts         # Guided prompts
│   └── themes.ts          # Visual themes
└── types/                 # TypeScript definitions
```

## How It Works

1. **Capture** - Each day, receive a prompt or notice something yourself. Write a brief observation.
2. **Review** - Browse your month's moments, toggle which to include in your Floem.
3. **Create** - Select 5-15 moments, arrange them, pick a theme, add scene descriptions.
4. **View** - Watch your Floem as an animated flip-book or read linearly.

## Deployment

Configured for Vercel deployment. Push to your repository and connect to Vercel for automatic deploys.
