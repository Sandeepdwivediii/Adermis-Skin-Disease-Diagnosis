'use client';

import React from 'react';
import { SkinAnalysisProvider } from './context/SkinAnalysisContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <SkinAnalysisProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SkinAnalysisProvider>
  );
}
