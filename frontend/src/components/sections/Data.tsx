'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Map, BarChart3, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/context';

const stats = [
  { value: '150-300m', labelKey: 'data.statistics.aquiferDepth' },
  { value: '1.5B m³', labelKey: 'data.statistics.annualRecharge' },
  { value: '200M m³', labelKey: 'data.statistics.abstraction' },
  { value: '15M+', labelKey: 'data.statistics.population' },
];

export default function Data() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="data"
      ref={sectionRef}
      className="w-full py-20 md:py-28 bg-white"
    >
      <div className="section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 mb-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-8 h-0.5 bg-smas-deep-blue" />
            <span className="text-smas-deep-blue text-sm font-semibold uppercase tracking-wider">
              {t('data.label')}
            </span>
            <span className="w-8 h-0.5 bg-smas-deep-blue" />
          </div>
          
          <h2
            className={`font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl text-smas-charcoal leading-tight mb-4 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('data.title')}{' '}
            <span className="text-smas-deep-blue">{t('data.titleHighlight')}</span>
          </h2>
          
          <p
            className={`text-smas-charcoal/70 leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('data.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-smas-off-white rounded-xl p-6 text-center border border-smas-sand-beige/50"
            >
              <span className="block font-montserrat font-bold text-2xl md:text-3xl text-smas-deep-blue mb-2">
                {stat.value}
              </span>
              <span className="text-sm text-smas-charcoal/60">{t(stat.labelKey)}</span>
            </div>
          ))}
        </div>

        {/* Data Cards */}
        <div
          className={`grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link href="/data/maps" className="group">
            <div className="bg-gradient-to-br from-smas-deep-blue to-smas-aqua rounded-xl p-6 text-white h-full card-hover">
              <Map className="w-12 h-12 mb-4" />
              <h3 className="font-montserrat font-bold text-xl mb-2">
                {t('nav.data.maps')}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Explore interactive maps of the aquifer system
              </p>
              <span className="inline-flex items-center text-sm font-medium">
                {t('data.viewMap')}
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link href="/data/statistics" className="group">
            <div className="bg-gradient-to-br from-smas-aqua to-smas-soft-green rounded-xl p-6 text-white h-full card-hover">
              <BarChart3 className="w-12 h-12 mb-4" />
              <h3 className="font-montserrat font-bold text-xl mb-2">
                {t('nav.data.statistics')}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                View key statistics and data visualizations
              </p>
              <span className="inline-flex items-center text-sm font-medium">
                View Statistics
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link href="/data/reports" className="group">
            <div className="bg-gradient-to-br from-smas-soft-green to-smas-earth-brown rounded-xl p-6 text-white h-full card-hover">
              <FileText className="w-12 h-12 mb-4" />
              <h3 className="font-montserrat font-bold text-xl mb-2">
                {t('nav.data.reports')}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Access technical reports and documentation
              </p>
              <span className="inline-flex items-center text-sm font-medium">
                {t('data.downloadReport')}
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
