'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, Leaf, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/context';

const components = [
  {
    icon: BookOpen,
    titleKey: 'components.component1.shortTitle',
    descriptionKey: 'components.component1.description',
    featuresKey: 'components.component1.features',
    href: '/smas/component-1',
    color: 'from-smas-deep-blue to-smas-aqua',
    number: '01',
  },
  {
    icon: Building2,
    titleKey: 'components.component2.shortTitle',
    descriptionKey: 'components.component2.description',
    featuresKey: 'components.component2.features',
    href: '/smas/component-2',
    color: 'from-smas-aqua to-smas-soft-green',
    number: '02',
  },
  {
    icon: Leaf,
    titleKey: 'components.component3.shortTitle',
    descriptionKey: 'components.component3.description',
    featuresKey: 'components.component3.features',
    href: '/smas/component-3',
    color: 'from-smas-soft-green to-smas-earth-brown',
    number: '03',
  },
  {
    icon: Users,
    titleKey: 'components.component4.shortTitle',
    descriptionKey: 'components.component4.description',
    featuresKey: 'components.component4.features',
    href: '/smas/component-4',
    color: 'from-smas-earth-brown to-smas-deep-blue',
    number: '04',
  },
];

export default function Components() {
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="components"
      ref={sectionRef}
      className="w-full py-16 md:py-28 bg-white"
    >
      <div className="section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div
            className={`inline-flex items-center gap-2 mb-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-8 h-0.5 bg-smas-deep-blue" />
            <span className="text-smas-deep-blue text-sm font-semibold uppercase tracking-wider">
              {t('components.label')}
            </span>
            <span className="w-8 h-0.5 bg-smas-deep-blue" />
          </div>

          <h2
            className={`font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl text-smas-charcoal leading-tight mb-4 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('components.title')}{' '}
            <span className="text-smas-deep-blue">{t('components.titleHighlight')}</span>
          </h2>

          <p
            className={`text-smas-charcoal/70 leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('components.subtitle')}
          </p>
        </div>

        {/* Components Grid — 2 cols on mobile, 4 on large screens */}
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {components.map((component, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl shadow-md overflow-hidden border border-smas-sand-beige/50 hover:shadow-xl transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${600 + index * 150}ms` }}
            >
              {/* Top gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${component.color}`} />

              <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
                {/* Icon */}
                <div
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${component.color} flex items-center justify-center mb-3 sm:mb-5 shadow-md flex-shrink-0`}
                >
                  <component.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-montserrat font-bold text-sm sm:text-base md:text-lg text-smas-charcoal mb-2 sm:mb-3 leading-snug">
                  {t(component.titleKey)}
                </h3>

                {/* Description — visible on sm+ */}
                <p className="hidden sm:block text-xs md:text-sm text-smas-charcoal/70 mb-4 leading-relaxed flex-grow">
                  {t(component.descriptionKey)}
                </p>

                {/* Features — visible on md+ */}
                <ul className="hidden md:block space-y-1.5 mb-4">
                  {([0, 1, 2, 3] as const).map((i) => {
                    const feat = t(`${component.featuresKey}.${i}`);
                    if (!feat || feat === `${component.featuresKey}.${i}`) return null;
                    return (
                      <li key={i} className="flex items-center gap-2 text-xs text-smas-charcoal/60">
                        <span className="w-1.5 h-1.5 bg-smas-aqua rounded-full flex-shrink-0" />
                        {feat}
                      </li>
                    );
                  })}
                </ul>

                {/* Button */}
                <Link href={component.href} className="mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs sm:text-sm group-hover:bg-smas-deep-blue group-hover:text-white group-hover:border-smas-deep-blue transition-all duration-300"
                  >
                    <span className="hidden sm:inline">{t('components.learnMore')}</span>
                    <span className="sm:hidden">Voir</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
