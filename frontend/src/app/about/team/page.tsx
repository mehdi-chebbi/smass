'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { User } from 'lucide-react';

const teamMembers = [
  { name: 'Dr. Amadou Diallo', role: 'Project Director', country: 'Senegal' },
  { name: 'Mme. Fatou Ndiaye', role: 'Technical Coordinator', country: 'Mauritania' },
  { name: 'Mr. João Silva', role: 'Data Manager', country: 'Guinea-Bissau' },
  { name: 'Ms. Kumba Jallow', role: 'Community Liaison', country: 'The Gambia' },
  { name: 'Dr. Mohammed Ould Ahmed', role: 'Hydrogeologist', country: 'Mauritania' },
  { name: 'Mme. Aissata Ba', role: 'Communications Officer', country: 'Senegal' },
];

export default function TeamPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.team.title"
      subtitleKey="pages.team.subtitle"
      backHref="/about"
      backLabelKey="nav.about.label"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-smas-sand-beige/50 card-hover"
          >
            <div className="w-20 h-20 rounded-full bg-smas-deep-blue/10 flex items-center justify-center mb-4 mx-auto">
              <User className="w-10 h-10 text-smas-deep-blue/50" />
            </div>
            <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal text-center mb-1">
              {member.name}
            </h3>
            <p className="text-smas-aqua text-sm text-center mb-2">{member.role}</p>
            <p className="text-smas-charcoal/50 text-xs text-center">{member.country}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
