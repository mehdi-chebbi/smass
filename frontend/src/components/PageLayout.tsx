'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { useI18n } from '@/i18n/context';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: ReactNode;
  titleKey: string;
  subtitleKey: string;
  backHref?: string;
  backLabelKey?: string;
}

export default function PageLayout({
  children,
  titleKey,
  subtitleKey,
  backHref,
  backLabelKey,
}: PageLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-smas-off-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-smas-deep-blue via-smas-deep-blue/90 to-smas-aqua/80 py-20 md:py-28">
          <div className="section-padding">
            {/* Back Link */}
            {backHref && backLabelKey && (
              <Link href={backHref} className="inline-block mb-6">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t(backLabelKey)}
                </Button>
              </Link>
            )}
            
            <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
              {t(titleKey)}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              {t(subtitleKey)}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-20">
          <div className="section-padding">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
