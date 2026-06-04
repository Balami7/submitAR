'use client';

import { SessionProvider } from 'next-auth/react';
import { FormProvider } from '@/context/FormContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FormProvider>{children}</FormProvider>
    </SessionProvider>
  );
}
