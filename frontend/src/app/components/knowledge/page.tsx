'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { BookOpen, Database, Map, BarChart3 } from 'lucide-react';

const activities = [
  {
    icon: Database,
    title: 'Data Collection',
    description: 'Systematic gathering of hydrogeological data from monitoring wells across the four countries.',
  },
  {
    icon: Map,
    title: 'Aquifer Mapping',
    description: 'Creating detailed maps of the aquifer structure, recharge zones, and flow patterns.',
  },
  {
    icon: BarChart3,
    title: 'Data Analysis',
    description: 'Advanced analysis of groundwater levels, quality parameters, and usage trends.',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Sharing',
    description: 'Development of platforms and protocols for sharing data among stakeholders.',
  },
];

export default function KnowledgePage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.knowledge.title"
      subtitleKey="pages.knowledge.subtitle"
      backHref="/components"
      backLabelKey="nav.components.label"
    >
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-smas-charcoal/80 leading-relaxed">
            The Knowledge Management component focuses on building a comprehensive understanding 
            of the Senegal-Mauritanian Aquifer System through systematic data collection, analysis, 
            and sharing among all stakeholders.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-smas-sand-beige/50"
              >
                <activity.icon className="w-8 h-8 text-smas-deep-blue mb-3" />
                <h3 className="font-montserrat font-semibold text-smas-charcoal mb-2">
                  {activity.title}
                </h3>
                <p className="text-sm text-smas-charcoal/60">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-smas-deep-blue/10 to-smas-aqua/10 rounded-2xl p-8 h-80 flex items-center justify-center">
          <BookOpen className="w-24 h-24 text-smas-deep-blue/30" />
        </div>
      </div>
    </PageLayout>
  );
}
