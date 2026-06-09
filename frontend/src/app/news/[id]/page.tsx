'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Calendar, User, Tag, ArrowLeft, Loader2, AlertCircle, File } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/lib/api/config';

export default function NewsDetailPage() {
  const params = useParams();
  const { t, locale } = useI18n();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/news/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => { setItem(data.news); setLoading(false); })
      .catch(() => { setError('News article not found.'); setLoading(false); });
  }, [params?.id]);

  const getField = (en: string, fr: string) => locale === 'fr' && item?.[fr] ? item[fr] : item?.[en] || '';

  return (
    <PageLayout titleKey="news.titleHighlight" subtitleKey="news.subtitle" backHref="/news" backLabelKey="nav.news.label">
      {loading && (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue" /></div>
      )}
      {error && (
        <div className="flex flex-col items-center gap-4 py-20 text-smas-charcoal/60">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p>{error}</p>
          <Link href="/news"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to News</Button></Link>
        </div>
      )}
      {item && (
        <article className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-smas-charcoal/60 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(item.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {item.isEvent && item.eventDate && (
              <span className="flex items-center gap-1 text-purple-700">
                <Calendar className="w-4 h-4" />
                Event: {new Date(item.eventDate).toLocaleDateString()}
              </span>
            )}
            {item.isEvent && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Event</span>
            )}
          </div>

          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-smas-charcoal mb-6">
            {getField('title', 'titleFr')}
          </h1>

          {item.featuredImage && (
            <div className="rounded-xl overflow-hidden mb-8 max-h-80">
              <img
                src={getAssetUrl(item.featuredImage)}
                alt={getField('title', 'titleFr')}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!item.featuredImage && (
            <div className="h-48 bg-gradient-to-br from-smas-deep-blue/20 to-smas-aqua/20 rounded-xl mb-8 flex items-center justify-center">
              <span className="text-smas-charcoal/30 text-sm">SMAS News</span>
            </div>
          )}

          {getField('excerpt', 'excerptFr') && (
            <p className="text-lg text-smas-charcoal/70 mb-6 italic border-l-4 border-smas-aqua pl-4">
              {getField('excerpt', 'excerptFr')}
            </p>
          )}

          <div className="prose prose-lg max-w-none text-smas-charcoal/80 leading-relaxed whitespace-pre-line">
            {getField('content', 'contentFr')}
          </div>

          <div className="mt-12 pt-6 border-t border-smas-sand-beige">
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('news.viewAll')}
              </Button>
            </Link>
          </div>
        </article>
      )}
    </PageLayout>
  );
}
