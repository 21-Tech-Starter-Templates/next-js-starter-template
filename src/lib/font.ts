import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
});

const fontMono = Inter({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace']
});

export const fontVariables = cn(fontSans.variable, fontMono.variable);
