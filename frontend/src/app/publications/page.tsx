'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import Link from 'next/link';
import { FileText, BarChart3, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

const publicationCategories = [
  {
    titleKey: 'publications.reports.title',
    descriptionKey: 'publications.reports.description',
    href: '/publications/reports',
    icon: FileText,
    color: 'from-smas-deep-blue to-smas-aqua',
  },
  {
    titleKey: 'publications.adaptation.title',
    descriptionKey: 'publications.adaptation.description',
    href: '/publications/adaptation',
    icon: BarChart3,
    color: 'from-smas-aqua to-smas-soft-green',
  },
  {
    titleKey: 'publications.knowledge.title',
    descriptionKey: 'publications.knowledge.description',
    href: '/publications/knowledge',
    icon: BookOpen,
    color: 'from-smas-soft-green to-smas-earth-brown',
  },
  {
    titleKey: 'publications.training.title',
    descriptionKey: 'publications.training.description',
    href: '/publications/training',
    icon: GraduationCap,
    color: 'from-smas-earth-brown to-smas-deep-blue',
  },
];

export default function PublicationsPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="publications.title"
      subtitleKey="publications.subtitle"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {publicationCategories.map((category) => (
          <Link key={category.href} href={category.href} className="group">
            <div className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white h-full card-hover`}>
              <category.icon className="w-12 h-12 mb-4" />
              <h3 className="font-montserrat font-bold text-xl mb-2">
                {t(category.titleKey)}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {t(category.descriptionKey)}
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
