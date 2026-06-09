'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Card, CardContent } from '@/components/ui/card';
import { Globe2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const countries = [
  {
    key: 'gambia',
    href: '/water/gambia',
    icon: '🇬🇲',
  },
  {
    key: 'guineaBissau',
    href: '/water/guinea-bissau',
    icon: '🇬🇼',
  },
  {
    key: 'mauritania',
    href: '/water/mauritania',
    icon: '🇲🇷',
  },
  {
    key: 'senegal',
    href: '/water/senegal',
    icon: '🇸🇳',
  },
];

export default function WaterPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="water.title"
      subtitleKey="water.subtitle"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {countries.map((country) => (
          <Link key={country.key} href={country.href}>
            <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:border-smas-aqua/50 cursor-pointer bg-white border border-smas-sand-beige/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-smas-deep-blue/10 flex items-center justify-center mb-4 group-hover:bg-smas-aqua/20 transition-colors">
                    <span className="text-3xl">{country.icon}</span>
                  </div>
                  <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-2">
                    {t(`water.countries.${country.key}.name`)}
                  </h3>
                  <p className="text-sm text-smas-charcoal/60 line-clamp-2 mb-4">
                    {t(`water.countries.${country.key}.description`)}
                  </p>
                  <div className="flex items-center gap-1 text-smas-aqua group-hover:gap-2 transition-all">
                    <span className="text-sm font-medium">{t('common.learnMore')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-xl p-8 border border-smas-sand-beige/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-smas-deep-blue/10 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-smas-deep-blue" />
          </div>
          <h2 className="font-montserrat font-bold text-xl text-smas-charcoal">
            {t('water.statistics.title')}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-lg bg-smas-off-white">
            <div className="font-montserrat font-bold text-3xl text-smas-deep-blue mb-1">350,000+</div>
            <div className="text-sm text-smas-charcoal/60">km² Area</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-smas-off-white">
            <div className="font-montserrat font-bold text-3xl text-smas-deep-blue mb-1">25M+</div>
            <div className="text-sm text-smas-charcoal/60">Population Served</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-smas-off-white">
            <div className="font-montserrat font-bold text-3xl text-smas-deep-blue mb-1">4</div>
            <div className="text-sm text-smas-charcoal/60">Countries</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-smas-off-white">
            <div className="font-montserrat font-bold text-3xl text-smas-deep-blue mb-1">500+</div>
            <div className="text-sm text-smas-charcoal/60">Monitoring Wells</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
