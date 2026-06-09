'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Loader2 } from 'lucide-react';

export default function StatisticsPage() {
  const { locale } = useI18n();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/statistics')
      .then(r => r.json())
      .then(data => { setStats(data.statistics || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getLabel = (s: any) => locale === 'fr' && s.labelFr ? s.labelFr : s.label;
  const getUnit = (s: any) => locale === 'fr' && s.unitFr ? s.unitFr : s.unit;

  return (
    <PageLayout titleKey="data.statistics_title" subtitleKey="data.subtitle">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-smas-deep-blue" /></div>
      ) : stats.length === 0 ? (
        <div className="text-center py-20 text-smas-charcoal/50"><p>No statistics available yet.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.id} className="bg-white rounded-xl border border-smas-sand-beige/50 p-6 text-center hover:shadow-md transition-shadow">
              {stat.icon && <div className="text-4xl mb-3">{stat.icon}</div>}
              <div className="text-3xl font-bold text-smas-deep-blue mb-1">
                {stat.value}
                {getUnit(stat) && <span className="text-lg font-normal text-smas-charcoal/50 ml-1">{getUnit(stat)}</span>}
              </div>
              <p className="text-sm text-smas-charcoal/70 font-medium">{getLabel(stat)}</p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
