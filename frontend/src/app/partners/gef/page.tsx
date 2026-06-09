'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Globe2, MapPin } from 'lucide-react';

export default function GEFPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="nav.partners.gef"
      subtitleKey="pages.partners.subtitle"
      backHref="/partners"
      backLabelKey="nav.partners.label"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-8 border border-smas-sand-beige/50">
            <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-4">
              Global Environment Facility
            </h2>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              The Global Environment Facility (GEF) is the primary funding partner for the SMAS project. 
              Established in 1992, GEF is the largest multilateral trust fund focused on enabling 
              developing countries to invest in nature.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              GEF supports the SMAS project as part of its International Waters focal area, which 
              addresses transboundary water management challenges worldwide.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed">
              The funding enables comprehensive hydrogeological studies, institutional strengthening, 
              and the establishment of sustainable management frameworks for the aquifer system.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
            <div className="w-20 h-20 rounded-full bg-smas-earth-brown/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-montserrat font-bold text-smas-earth-brown text-2xl">GEF</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <MapPin className="w-4 h-4" />
                <span>Washington, D.C., USA</span>
              </div>
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <Globe2 className="w-4 h-4" />
                <a href="https://www.thegef.org" target="_blank" rel="noopener noreferrer" className="hover:text-smas-deep-blue">
                  www.thegef.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
