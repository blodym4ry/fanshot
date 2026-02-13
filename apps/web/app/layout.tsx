import type { Metadata, Viewport } from 'next';
import { Oswald } from 'next/font/google';
import { ToastProvider } from '@/src/components/providers/ToastProvider';
import { I18nProvider } from '@/src/components/providers/I18nProvider';
import { AiFooterProvider } from '@/src/components/providers/AiFooterProvider';
import './globals.css';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FanShot - FIFA World Cup 2026 AI Photo Experience',
  description:
    'Upload your selfie, pick a World Cup scene, and get an AI-generated realistic fan photo.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#08080F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={oswald.variable}>
      <body className="min-h-screen bg-bg-primary font-body text-text-primary antialiased">
        <I18nProvider />
        {children}
        <AiFooterProvider />
        <ToastProvider />
      </body>
    </html>
  );
}
