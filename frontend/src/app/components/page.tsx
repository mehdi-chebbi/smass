'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import Link from 'next/link';
import { BookOpen, Building2, Users, ArrowRight } from 'lucide-react';

const components = [
  {
    titleKey: 'components.knowledge.title',
    descriptionKey: 'components.knowledge.description',
    href: '/components/knowledge',
    icon: BookOpen,
    color: 'from-smas-deep-blue to-smas-aqua',
  },
  {
    titleKey: 'components.governance.title',
    descriptionKey: 'components.governance.description',
    href: '/components/governance',
    icon: Building2,
    color: 'from-smas-aqua to-smas-soft-green',
  },
  {
    titleKey: 'components.capacity.title',
    descriptionKey: 'components.capacity.description',
    href: '/components/capacity',
    icon: Users,
    color: 'from-smas-soft-green to-smas-earth-brown',
  },
];

export default function ComponentsPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="components.label"
      subtitleKey="components.subtitle"
    >
      <div className="grid md:grid-cols-3 gap-6">
        {components.map((component) => (
          <Link key={component.href} href={component.href} className="group">
            <div className="bg-white rounded-xl overflow-hidden border border-smas-sand-beige/50 card-hover h-full">
              <div className={`h-2 bg-gradient-to-r ${component.color}`} />
              <div className="p-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${component.color} flex items-center justify-center mb-4`}>
                  <component.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-smas-charcoal mb-2">
                  {t(component.titleKey)}
                </h3>
                <p className="text-smas-charcoal/60 text-sm mb-4">
                  {t(component.descriptionKey)}
                </p>
                <span className="inline-flex items-center text-smas-deep-blue text-sm font-medium group-hover:translate-x-1 transition-transform">
                  {t('components.learnMore')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
