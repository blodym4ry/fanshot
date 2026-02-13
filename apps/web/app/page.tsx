import type { Metadata } from 'next';
import { LandingPage } from '@/src/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'FanShot — Dünya Kupası 2026 AI Fotoğraf Deneyimi',
  description:
    "FIFA Dünya Kupası 2026'da sen de sahada ol! AI ile dünya kupası yıldızlarıyla gerçekçi fotoğrafını oluştur. İlk fotoğraf ücretsiz.",
  keywords:
    'world cup 2026, dünya kupası, ai fotoğraf, futbol, fifa, fanshot',
  openGraph: {
    title: 'FanShot — Dünya Kupası 2026 AI Fotoğraf Deneyimi',
    description:
      "FIFA Dünya Kupası 2026'da sen de sahada ol! AI ile gerçekçi fotoğrafını oluştur.",
    type: 'website',
    siteName: 'FanShot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FanShot — Dünya Kupası 2026 AI Fotoğraf Deneyimi',
    description:
      "FIFA Dünya Kupası 2026'da sen de sahada ol! AI ile gerçekçi fotoğrafını oluştur.",
  },
};

export default function Home() {
  return <LandingPage />;
}
