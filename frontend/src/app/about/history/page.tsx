'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Calendar } from 'lucide-react';

const milestones = [
  { year: '2019', event: 'Project conception and initial stakeholder meetings' },
  { year: '2020', event: 'Formal agreement signed by four beneficiary countries' },
  { year: '2021', event: 'Launch of hydrogeological studies and data collection' },
  { year: '2022', event: 'Establishment of regional coordination mechanisms' },
  { year: '2023', event: 'Implementation of monitoring systems and capacity building' },
  { year: '2024', event: 'Continued expansion and knowledge sharing initiatives' },
];

export default function HistoryPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.history.title"
      subtitleKey="pages.history.subtitle"
      backHref="/about"
      backLabelKey="nav.about.label"
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-smas-sand-beige" />

          {milestones.map((milestone, index) => (
            <div key={index} className="relative pl-20 pb-8 last:pb-0">
              {/* Timeline dot */}
              <div className="absolute left-6 w-5 h-5 bg-smas-deep-blue rounded-full border-4 border-white shadow" />
              
              <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-smas-aqua" />
                  <span className="font-montserrat font-bold text-smas-deep-blue">
                    {milestone.year}
                  </span>
                </div>
                <p className="text-smas-charcoal/80">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
