'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Droplets, Users, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.about.title"
      subtitleKey="pages.about.subtitle"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-smas-charcoal/80 leading-relaxed">
              {t('about.description1')}
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed">
              {t('about.description2')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
              <Droplets className="w-8 h-8 text-smas-deep-blue mb-3" />
              <h3 className="font-montserrat font-semibold text-smas-charcoal mb-2">
                {t('about.features.waterSecurity.title')}
              </h3>
              <p className="text-sm text-smas-charcoal/60">
                {t('about.features.waterSecurity.description')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
              <Users className="w-8 h-8 text-smas-aqua mb-3" />
              <h3 className="font-montserrat font-semibold text-smas-charcoal mb-2">
                {t('about.features.regionalCooperation.title')}
              </h3>
              <p className="text-sm text-smas-charcoal/60">
                {t('about.features.regionalCooperation.description')}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/about/team">
              <Button className="btn-primary">
                {t('nav.about.team')}
              </Button>
            </Link>
            <Link href="/about/history">
              <Button variant="outline">
                {t('nav.about.history')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-smas-deep-blue/10 to-smas-aqua/10 rounded-2xl p-8 h-96 flex items-center justify-center">
          <MapPin className="w-24 h-24 text-smas-deep-blue/30" />
        </div>
      </div>
    </PageLayout>
  );
}
