'use client';

import { Header } from './Header';
import { BottomTabBar } from './BottomTabBar';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="relative mx-auto min-h-screen max-w-[480px]">
      {/* Stadium floodlight effects */}
      <div className="floodlight-left" />
      <div className="floodlight-right" />

      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Header */}
      <Header />

      {/* Main content area */}
      <main className="relative z-10 px-4 pb-24 pt-4">{children}</main>

      {/* Bottom navigation */}
      <BottomTabBar />
    </div>
  );
}
