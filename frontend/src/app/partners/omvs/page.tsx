'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Globe2, MapPin } from 'lucide-react';

export default function OMVSPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="nav.partners.omvs"
      subtitleKey="pages.partners.subtitle"
      backHref="/partners"
      backLabelKey="nav.partners.label"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-8 border border-smas-sand-beige/50">
            <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-4">
              Organization for the Development of the Senegal River
            </h2>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              The Organization for the Development of the Senegal River (OMVS) is a regional organization 
              established in 1972 by Guinea, Mali, Mauritania, and Senegal to promote the sustainable 
              development of the Senegal River basin.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed">
              OMVS provides valuable expertise in transboundary water management and supports the SMAS 
              project through coordination with riparian communities and technical knowledge sharing.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
            <div className="w-20 h-20 rounded-full bg-smas-aqua/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-montserrat font-bold text-smas-aqua text-2xl">OMVS</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <MapPin className="w-4 h-4" />
                <span>Dakar, Senegal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
