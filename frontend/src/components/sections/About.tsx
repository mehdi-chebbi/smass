'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Droplets, Users, Globe2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/context';

const features = [
  {
    icon: Droplets,
    titleKey: 'about.features.waterSecurity.title',
    descriptionKey: 'about.features.waterSecurity.description',
  },
  {
    icon: Users,
    titleKey: 'about.features.regionalCooperation.title',
    descriptionKey: 'about.features.regionalCooperation.description',
  },
  {
    icon: Globe2,
    titleKey: 'about.features.transboundary.title',
    descriptionKey: 'about.features.transboundary.description',
  },
  {
    icon: Shield,
    titleKey: 'about.features.climateResilience.title',
    descriptionKey: 'about.features.climateResilience.description',
  },
];

export default function About() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full py-20 md:py-28 bg-smas-off-white"
    >
      <div className="section-padding">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Text Content */}
          <div
            className={`space-y-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-0.5 bg-smas-deep-blue" />
              <span className="text-smas-deep-blue text-sm font-semibold uppercase tracking-wider">
                {t('about.label')}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl text-smas-charcoal leading-tight">
              {t('about.title')}{' '}
              <span className="text-smas-deep-blue">{t('about.titleHighlight')}</span>{' '}
              {t('about.titleEnd')}
            </h2>

            {/* Description */}
            <div className="space-y-4 text-smas-charcoal/70 leading-relaxed">
              <p>{t('about.description1')}</p>
              <p>{t('about.description2')}</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-smas-sand-beige">
              <div>
                <span className="block font-montserrat font-bold text-2xl md:text-3xl text-smas-deep-blue">
                  4
                </span>
                <span className="text-sm text-smas-charcoal/60">{t('about.countries')}</span>
              </div>
              <div>
                <span className="block font-montserrat font-bold text-2xl md:text-3xl text-smas-deep-blue">
                  300K
                </span>
                <span className="text-sm text-smas-charcoal/60">{t('about.area')}</span>
              </div>
              <div>
                <span className="block font-montserrat font-bold text-2xl md:text-3xl text-smas-deep-blue">
                  3
                </span>
                <span className="text-sm text-smas-charcoal/60">{t('about.years')}</span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/components">
              <Button
                variant="link"
                className="inline-flex items-center gap-2 text-smas-deep-blue font-semibold group p-0"
              >
                {t('about.exploreComponents')}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-smas-deep-blue/20 to-smas-aqua/20 aspect-[4/3]">
              {/* Placeholder Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplets className="w-24 h-24 text-smas-deep-blue/30" />
              </div>
              
              {/* Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-smas-deep-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-6 h-6 text-smas-deep-blue" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold text-smas-charcoal mb-1">
                      {t('about.groundwaterManagement')}
                    </h4>
                    <p className="text-sm text-smas-charcoal/60">
                      {t('about.groundwaterDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-smas-aqua/10 rounded-full -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-smas-deep-blue/10 rounded-full -z-10" />
          </div>
        </div>

        {/* Features Grid */}
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 shadow-sm card-hover cursor-pointer border border-smas-sand-beige/50"
            >
              <div className="w-14 h-14 bg-smas-deep-blue/10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-smas-deep-blue group-hover:scale-110">
                <feature.icon className="w-7 h-7 text-smas-deep-blue transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="font-montserrat font-semibold text-smas-charcoal mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-smas-charcoal/60">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
