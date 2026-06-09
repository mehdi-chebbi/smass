'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Globe2, MapPin } from 'lucide-react';

export default function UNEPPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="nav.partners.unep"
      subtitleKey="pages.partners.subtitle"
      backHref="/partners"
      backLabelKey="nav.partners.label"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-8 border border-smas-sand-beige/50">
            <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-4">
              United Nations Environment Programme
            </h2>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              The United Nations Environment Programme (UNEP) is the leading global environmental 
              authority that sets the global environmental agenda and promotes the coherent 
              implementation of the environmental dimension of sustainable development.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed mb-4">
              UNEP provides technical guidance and international coordination support to the SMAS 
              project, ensuring alignment with global environmental standards and best practices.
            </p>
            <p className="text-smas-charcoal/80 leading-relaxed">
              Through its expertise in environmental governance and capacity building, UNEP helps 
              strengthen the institutional frameworks needed for sustainable groundwater management.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
            <div className="w-20 h-20 rounded-full bg-smas-charcoal/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-montserrat font-bold text-smas-charcoal text-2xl">UNEP</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-smas-charcoal/70">
                <Globe2 className="w-4 h-4" />
                <a href="https://www.unep.org" target="_blank" rel="noopener noreferrer" className="hover:text-smas-deep-blue">
                  www.unep.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
