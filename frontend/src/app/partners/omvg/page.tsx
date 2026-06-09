'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { MapPin } from 'lucide-react';

export default function OMVGPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="nav.partners.omvg"
      subtitleKey="pages.partners.subtitle"
      backHref="/partners"
      backLabelKey="nav.partners.label"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-8 border border-smas-sand-beige/50">
            <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-4">
              Organization for the Development of the Gambia River
            </h2>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              The Organization for the Development of the Gambia River (OMVG) is a regional organization 
              founded in 1978 by The Gambia, Guinea, Guinea-Bissau, and Senegal to coordinate development 
              efforts in the Gambia River basin.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed">
              OMVG contributes to the SMAS project through its experience in integrated water resources 
              management and community engagement across member countries.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
            <div className="w-20 h-20 rounded-full bg-smas-soft-green/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-montserrat font-bold text-smas-soft-green text-2xl">OMVG</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <MapPin className="w-4 h-4" />
                <span>Banjul, The Gambia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
