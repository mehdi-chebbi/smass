'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { ExternalLink, Loader2 } from 'lucide-react';
import { getAssetUrl } from '@/lib/api/config';

export default function PartnersPage() {
  const { locale } = useI18n();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partners')
      .then(r => r.json())
      .then(data => { setPartners(data.partners || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getName = (p: any) => locale === 'fr' && p.nameFr ? p.nameFr : p.name;
  const getDesc = (p: any) => locale === 'fr' && p.descriptionFr ? p.descriptionFr : p.description;

  return (
    <PageLayout titleKey="partners.title" subtitleKey="partners.subtitle">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue" /></div>
      ) : partners.length === 0 ? (
        <div className="text-center py-20 text-smas-charcoal/50"><p>No partners listed yet.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map(partner => (
            <div key={partner.id} className="bg-white rounded-xl border border-smas-sand-beige/50 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow card-hover">
              <div className="w-24 h-24 flex items-center justify-center mb-4">
                <img
                  src={getAssetUrl(partner.logo)}
                  alt={getName(partner)}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <h3 className="font-montserrat font-semibold text-smas-charcoal mb-2">{getName(partner)}</h3>
              {getDesc(partner) && (
                <p className="text-sm text-smas-charcoal/60 mb-4 line-clamp-3">{getDesc(partner)}</p>
              )}
              {partner.website && (
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-smas-deep-blue text-sm flex items-center gap-1 hover:underline mt-auto">
                  <ExternalLink className="w-3 h-3" /> Visit website
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
