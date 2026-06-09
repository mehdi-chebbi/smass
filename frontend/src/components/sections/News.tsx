'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/context';
import { getAssetUrl } from '@/lib/api/config';

export default function News() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('/api/news?limit=3')
      .then(r => r.json())
      .then(data => { setNewsItems(data.news || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getTitle = (item: any) => locale === 'fr' && item.titleFr ? item.titleFr : item.title;
  const getExcerpt = (item: any) => locale === 'fr' && item.excerptFr ? item.excerptFr : item.excerpt;

  return (
    <section id="news" ref={sectionRef} className="w-full py-20 md:py-28 bg-smas-off-white">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className={`inline-flex items-center gap-2 mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="w-8 h-0.5 bg-smas-deep-blue" />
              <span className="text-smas-deep-blue text-sm font-semibold uppercase tracking-wider">{t('news.label')}</span>
            </div>
            <h2 className={`font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl text-smas-charcoal leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {t('news.title')}{' '}<span className="text-smas-deep-blue">{t('news.titleHighlight')}</span>
            </h2>
          </div>
          <Link href="/news" className="mt-4 md:mt-0">
            <Button variant="outline" className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {t('news.viewAll')}<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue/40" /></div>
        )}

        {!loading && newsItems.length === 0 && (
          <div className="text-center py-12 text-smas-charcoal/40">
            <p>News coming soon. Check back later.</p>
          </div>
        )}

        {!loading && newsItems.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <article
                key={item.id}
                className={`group bg-white rounded-xl overflow-hidden shadow-sm border border-smas-sand-beige/50 card-hover transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${600 + index * 200}ms` }}
              >
                <div className="h-48 bg-gradient-to-br from-smas-deep-blue/20 to-smas-aqua/20 relative overflow-hidden">
                  {item.featuredImage ? (
                    <img src={getAssetUrl(item.featuredImage)} alt={getTitle(item)} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-smas-deep-blue/30" />
                    </div>
                  )}
                  {item.isEvent && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-purple-700 text-white text-xs font-medium rounded-full">Event</span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-sm text-smas-charcoal/50 mb-2">
                    {new Date(item.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-3 group-hover:text-smas-deep-blue transition-colors line-clamp-2">
                    {getTitle(item)}
                  </h3>
                  {getExcerpt(item) && (
                    <p className="text-sm text-smas-charcoal/60 mb-4 line-clamp-2">{getExcerpt(item)}</p>
                  )}
                  <Link href={`/news/${item.id}`}>
                    <Button variant="link" className="p-0 text-smas-deep-blue font-medium group/link">
                      {t('news.readMore')}<ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
