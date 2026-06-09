'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import Link from 'next/link';
import { Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/lib/api/config';

export default function NewsPage() {
  const { t, locale } = useI18n();
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/news?limit=50')
      .then(r => r.json())
      .then(data => {
        setNewsItems(data.news || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load news');
        setLoading(false);
      });
  }, []);

  const getTitle = (item: any) => locale === 'fr' && item.titleFr ? item.titleFr : item.title;
  const getExcerpt = (item: any) => locale === 'fr' && item.excerptFr ? item.excerptFr : item.excerpt;

  return (
    <PageLayout titleKey="news.titleHighlight" subtitleKey="news.subtitle">
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue" />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 py-8 justify-center">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      {!loading && !error && newsItems.length === 0 && (
        <div className="text-center py-20 text-smas-charcoal/50">
          <p className="text-lg">No news published yet.</p>
        </div>
      )}
      {!loading && !error && newsItems.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.filter(n => !n.isEvent).map((item) => (
            <article key={item.id} className="bg-white rounded-xl overflow-hidden border border-smas-sand-beige/50 card-hover">
              <div className="h-48 bg-gradient-to-br from-smas-deep-blue/20 to-smas-aqua/20 relative overflow-hidden">
                {item.featuredImage && (
                  <img src={getAssetUrl(item.featuredImage)} alt={getTitle(item)} className="w-full h-full object-cover" />
                )}
                {item.isEvent && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-purple-700 text-white text-xs font-medium rounded-full">Event</span>
                )}
              </div>
              <div className="p-6">
                <p className="text-sm text-smas-charcoal/50 mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-3 line-clamp-2">
                  {getTitle(item)}
                </h3>
                {getExcerpt(item) && (
                  <p className="text-sm text-smas-charcoal/60 mb-4 line-clamp-2">{getExcerpt(item)}</p>
                )}
                <Link href={`/news/${item.id}`}>
                  <Button variant="link" className="p-0 text-smas-deep-blue">
                    {t('news.readMore')}
                    <ArrowRight className="w-4 h-4 ml-1" />
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
