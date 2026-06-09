'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Calendar, Briefcase, Download, Loader2, ExternalLink, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAssetUrl } from '@/lib/api/config';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-emerald-100 text-emerald-800',
  CLOSED: 'bg-red-100 text-red-800',
  AWARDED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
  DRAFT: 'bg-amber-100 text-amber-800',
};

export default function TendersPage() {
  const { locale } = useI18n();
  const [tenders, setTenders] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = filter ? `/api/tenders?status=${filter}&limit=50` : '/api/tenders?limit=50';
    fetch(url)
      .then(r => r.json())
      .then(data => { setTenders(data.tenders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const getField = (item: any, en: string, fr: string) =>
    locale === 'fr' && item[fr] ? item[fr] : item[en] || '';

  return (
    <PageLayout titleKey="workWithUs.tenders" subtitleKey="workWithUs.subtitle">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['', 'OPEN', 'CLOSED', 'AWARDED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-smas-deep-blue text-white' : 'bg-white border border-smas-sand-beige text-smas-charcoal hover:bg-smas-sand-beige/30'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue" /></div>
      ) : tenders.length === 0 ? (
        <div className="text-center py-20 text-smas-charcoal/50"><p>No tenders at this time.</p></div>
      ) : (
        <div className="space-y-4">
          {tenders.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-smas-sand-beige/50 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[item.status] || 'bg-gray-100'}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-smas-charcoal/50 bg-slate-100 px-2 py-0.5 rounded-full">{item.type}</span>
                    {item.reference && <span className="text-xs font-mono text-smas-charcoal/40">{item.reference}</span>}
                  </div>
                  <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-2">
                    {getField(item, 'title', 'titleFr')}
                  </h3>
                  {getField(item, 'description', 'descriptionFr') && (
                    <p className="text-sm text-smas-charcoal/60 mb-3 line-clamp-2">
                      {getField(item, 'description', 'descriptionFr')}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-smas-charcoal/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Deadline: <strong className="text-smas-charcoal/80">{new Date(item.deadline).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}</strong>
                    </span>
                    {item.budget && (
                      <span className="flex items-center gap-1">
                        Budget: <strong>{item.budget.toLocaleString()} {item.currency || 'USD'}</strong>
                      </span>
                    )}
                  </div>
                  {(item.contactEmail || item.contactName) && (
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-smas-charcoal/50">
                      {item.contactName && <span>{item.contactName}</span>}
                      {item.contactEmail && (
                        <a href={`mailto:${item.contactEmail}`} className="flex items-center gap-1 text-smas-deep-blue hover:underline">
                          <Mail className="w-3 h-3" />{item.contactEmail}
                        </a>
                      )}
                    </div>
                  )}
                </div>
                {item.documentUrl && (
                  <a
                    href={getAssetUrl(item.documentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
