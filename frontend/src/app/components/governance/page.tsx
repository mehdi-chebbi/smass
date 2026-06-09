'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Building2, FileText, Users, Scale } from 'lucide-react';

const elements = [
  {
    icon: Scale,
    title: 'Legal Framework',
    description: 'Development of transboundary water agreements and protocols.',
  },
  {
    icon: Building2,
    title: 'Institutional Structure',
    description: 'Establishment of joint committees and coordination mechanisms.',
  },
  {
    icon: Users,
    title: 'Stakeholder Engagement',
    description: 'Inclusive participation of communities, government agencies, and civil society.',
  },
  {
    icon: FileText,
    title: 'Policy Development',
    description: 'Formulation of harmonized policies for sustainable groundwater management.',
  },
];

export default function GovernancePage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.governance.title"
      subtitleKey="pages.governance.subtitle"
      backHref="/components"
      backLabelKey="nav.components.label"
    >
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-smas-charcoal/80 leading-relaxed">
            The Governance Framework component establishes the institutional mechanisms necessary 
            for effective transboundary cooperation and sustainable resource management across 
            the four beneficiary countries.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {elements.map((element, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-smas-sand-beige/50"
              >
                <element.icon className="w-8 h-8 text-smas-aqua mb-3" />
                <h3 className="font-montserrat font-semibold text-smas-charcoal mb-2">
                  {element.title}
                </h3>
                <p className="text-sm text-smas-charcoal/60">
                  {element.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-smas-aqua/10 to-smas-soft-green/10 rounded-2xl p-8 h-80 flex items-center justify-center">
          <Building2 className="w-24 h-24 text-smas-aqua/30" />
        </div>
      </div>
    </PageLayout>
  );
}
