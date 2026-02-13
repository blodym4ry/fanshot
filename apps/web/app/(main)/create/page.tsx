import { Suspense } from 'react';
import { CreateFlow } from '@/src/components/create/CreateFlow';

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <span className="text-2xl">⚽</span>
        </div>
      }
    >
      <CreateFlow />
    </Suspense>
  );
}
