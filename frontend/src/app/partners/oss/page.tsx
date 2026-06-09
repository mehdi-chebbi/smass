'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Globe2, MapPin, Link as LinkIcon } from 'lucide-react';

export default function OSSPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="nav.partners.oss"
      subtitleKey="pages.partners.subtitle"
      backHref="/partners"
      backLabelKey="nav.partners.label"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-8 border border-smas-sand-beige/50">
            <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-4">
              Observatory of the Sahara and the Sahel
            </h2>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              The Observatory of the Sahara and the Sahel (OSS) is an independent international organization 
              based in Tunis, Tunisia. Established in 1992, OSS works to combat desertification and 
              implement sustainable development projects in Africa.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              As the implementing agency for the SMAS project, OSS coordinates activities across all four 
              beneficiary countries, ensuring effective collaboration and knowledge sharing among stakeholders.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed">
              OSS brings decades of experience in transboundary water management, environmental monitoring, 
              and capacity building to support the sustainable management of the Senegal-Mauritanian Aquifer System.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
            <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-4">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {[
                'Project coordination and management',
                'Technical guidance and quality assurance',
                'Stakeholder engagement and communication',
                'Monitoring and evaluation',
                'Knowledge management and sharing',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-smas-charcoal/70">
                  <span className="w-2 h-2 bg-smas-deep-blue rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
            <div className="w-20 h-20 rounded-full bg-smas-deep-blue/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-montserrat font-bold text-smas-deep-blue text-2xl">OSS</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <MapPin className="w-4 h-4" />
                <span>Tunis, Tunisia</span>
              </div>
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <Globe2 className="w-4 h-4" />
                <a href="https://www.oss-online.org" target="_blank" rel="noopener noreferrer" className="hover:text-smas-deep-blue">
                  www.oss-online.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
