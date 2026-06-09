'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import Link from 'next/link';
import { Map, BarChart3, FileText, ArrowRight } from 'lucide-react';

const dataResources = [
  {
    titleKey: 'nav.data.maps',
    description: 'Explore interactive maps of the aquifer system',
    href: '/data/maps',
    icon: Map,
    color: 'from-smas-deep-blue to-smas-aqua',
  },
  {
    titleKey: 'nav.data.statistics',
    description: 'View key statistics and data visualizations',
    href: '/data/statistics',
    icon: BarChart3,
    color: 'from-smas-aqua to-smas-soft-green',
  },
  {
    titleKey: 'nav.data.reports',
    description: 'Access technical reports and documentation',
    href: '/data/reports',
    icon: FileText,
    color: 'from-smas-soft-green to-smas-earth-brown',
  },
];

export default function DataPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="data.label"
      subtitleKey="data.subtitle"
    >
      <div className="grid md:grid-cols-3 gap-6">
        {dataResources.map((resource) => (
          <Link key={resource.href} href={resource.href} className="group">
            <div className={`bg-gradient-to-br ${resource.color} rounded-xl p-6 text-white h-full card-hover`}>
              <resource.icon className="w-12 h-12 mb-4" />
              <h3 className="font-montserrat font-bold text-xl mb-2">
                {t(resource.titleKey)}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {resource.description}
              </p>
              <span className="inline-flex items-center text-sm font-medium">
                Explore
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
