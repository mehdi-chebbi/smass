'use client';
import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { FileText, Download, Calendar, Loader2, Image as ImageIcon, Video, File } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getAssetUrl } from '@/lib/api/config';
function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType?.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
  if (mimeType?.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
  if (mimeType === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
}
export default function Page() {
  const { locale } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/publications?type=ADAPTATION&limit=50')
      .then(r => r.json()).then(d => { setItems(d.publications || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return (
    <PageLayout titleKey="publications.adaptation.title" subtitleKey="publications.adaptation.description" backHref="/publications" backLabelKey="publications.label">
      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue" /></div>
        : items.length === 0 ? <div className="text-center py-20 text-smas-charcoal/40">Aucune publication dans cette catégorie.</div>
        : <div className="space-y-4">{items.map(item => {
            const title = locale === 'fr' && item.titleFr ? item.titleFr : item.title;
            const description = locale === 'fr' && item.descriptionFr ? item.descriptionFr : item.description;
            const files = item.files ? (() => { try { return JSON.parse(item.files); } catch { return []; } })() : [];
            return (
              <Card key={item.id} className="border-smas-sand-beige/50 card-hover overflow-hidden">
                <CardContent className="p-0"><div className="flex flex-col sm:flex-row">
                  <div className="sm:w-36 h-36 sm:h-auto bg-gradient-to-br from-smas-deep-blue/10 to-smas-aqua/10 flex items-center justify-center shrink-0">
                    {item.coverImage ? <img src={getAssetUrl(item.coverImage)} alt={title} className="w-full h-full object-cover" /> : <FileText className="w-10 h-10 text-smas-deep-blue/30" />}
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal">{title}</h3>
                      {item.date && <span className="text-xs text-smas-charcoal/40 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long' })}</span>}
                    </div>
                    {description && <p className="text-sm text-smas-charcoal/60 mb-3 line-clamp-2">{description}</p>}
                    {files.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{files.map((f: any, i: number) => (
                      <a key={i} href={getAssetUrl(f.url)} target="_blank" rel="noopener noreferrer" download={f.filename}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-smas-deep-blue/10 hover:bg-smas-deep-blue text-smas-deep-blue hover:text-white rounded-lg text-xs font-medium transition-colors">
                        <FileIcon mimeType={f.mimeType} />{(locale === 'fr' && f.labelFr) ? f.labelFr : (f.label || f.filename)}<Download className="w-3 h-3 ml-0.5" />
                      </a>
                    ))}</div>}
                  </div>
                </div></CardContent>
              </Card>
            );
          })}</div>
      }
    </PageLayout>
  );
}
