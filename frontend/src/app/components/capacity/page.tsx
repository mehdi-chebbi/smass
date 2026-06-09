'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Users, GraduationCap, Wrench, Building } from 'lucide-react';

const programs = [
  {
    icon: GraduationCap,
    title: 'Training Programs',
    description: 'Comprehensive training for water resource professionals.',
  },
  {
    icon: Wrench,
    title: 'Technical Assistance',
    description: 'Expert support for implementing monitoring and management systems.',
  },
  {
    icon: Users,
    title: 'Knowledge Transfer',
    description: 'Sharing best practices and technical knowledge across borders.',
  },
  {
    icon: Building,
    title: 'Institutional Strengthening',
    description: 'Building organizational capacity for long-term sustainability.',
  },
];

export default function CapacityPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.capacity.title"
      subtitleKey="pages.capacity.subtitle"
      backHref="/components"
      backLabelKey="nav.components.label"
    >
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-smas-charcoal/80 leading-relaxed">
            The Capacity Building component focuses on strengthening national and regional 
            capabilities for effective water resource management through training, technical 
            assistance, and institutional development.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-smas-sand-beige/50"
              >
                <program.icon className="w-8 h-8 text-smas-soft-green mb-3" />
                <h3 className="font-montserrat font-semibold text-smas-charcoal mb-2">
                  {program.title}
                </h3>
                <p className="text-sm text-smas-charcoal/60">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-smas-soft-green/10 to-smas-earth-brown/10 rounded-2xl p-8 h-80 flex items-center justify-center">
          <Users className="w-24 h-24 text-smas-soft-green/30" />
        </div>
      </div>
    </PageLayout>
  );
}
