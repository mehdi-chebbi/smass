'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Map as MapIcon, Layers, Navigation } from 'lucide-react';

export default function MapsPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.maps.title"
      subtitleKey="pages.maps.subtitle"
      backHref="/data"
      backLabelKey="nav.data.label"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-smas-sand-beige/50 overflow-hidden h-[500px] flex items-center justify-center">
            <div className="text-center">
              <MapIcon className="w-20 h-20 text-smas-deep-blue/20 mx-auto mb-4" />
              <p className="text-smas-charcoal/60">Interactive Map Coming Soon</p>
              <p className="text-sm text-smas-charcoal/40 mt-2">
                Explore the aquifer system layers and monitoring points
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-smas-sand-beige/50">
            <h3 className="font-montserrat font-semibold text-smas-charcoal mb-4">Map Layers</h3>
            <div className="space-y-3">
              {['Aquifer Extent', 'Monitoring Wells', 'Recharge Zones', 'Political Boundaries'].map((layer) => (
                <label key={layer} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-smas-sand-beige text-smas-deep-blue focus:ring-smas-deep-blue" />
                  <span className="text-sm text-smas-charcoal/70">{layer}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-smas-sand-beige/50">
            <h3 className="font-montserrat font-semibold text-smas-charcoal mb-4">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 p-2 rounded-lg bg-smas-sand-beige/30 text-smas-charcoal/70 text-sm hover:bg-smas-sand-beige/50 transition-colors">
                <Layers className="w-4 h-4" /> Layers
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg bg-smas-sand-beige/30 text-smas-charcoal/70 text-sm hover:bg-smas-sand-beige/50 transition-colors">
                <Navigation className="w-4 h-4" /> Navigate
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
