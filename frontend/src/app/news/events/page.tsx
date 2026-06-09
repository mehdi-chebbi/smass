'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import Link from 'next/link';
import { Calendar, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/lib/api/config';

export default function EventsPage() {
  const { t, locale } = useI18n();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?isEvent=true&limit=50')
      .then(r => r.json())
      .then(data => { setEvents(data.news || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getTitle = (item: any) => locale === 'fr' && item.titleFr ? item.titleFr : item.title;
  const getExcerpt = (item: any) => locale === 'fr' && item.excerptFr ? item.excerptFr : item.excerpt;

  return (
    <PageLayout titleKey="news.events" subtitleKey="news.subtitle">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-smas-charcoal/50"><p>No upcoming events.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map(item => (
            <article key={item.id} className="bg-white rounded-xl border border-smas-sand-beige/50 card-hover overflow-hidden flex">
              <div className="w-2 bg-purple-600 shrink-0" />
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-purple-700 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{item.eventDate ? new Date(item.eventDate).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBD'}</span>
                </div>
                <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-2">{getTitle(item)}</h3>
                {getExcerpt(item) && <p className="text-sm text-smas-charcoal/60 mb-4">{getExcerpt(item)}</p>}
                <Link href={`/news/${item.id}`}>
                  <Button variant="link" className="p-0 text-smas-deep-blue">
                    {t('news.readMore')} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
