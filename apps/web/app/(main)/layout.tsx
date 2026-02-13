import { MobileLayout } from '@/src/components/layout/MobileLayout';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileLayout>
      {children}
    </MobileLayout>
  );
}
