'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplets, Shield, TestTube, MapPin, TrendingUp, Cloud, Zap } from 'lucide-react';

const activities = [
  {
    icon: Shield,
    titleKey: 'pages.component3.activities.solutions.title',
    descriptionKey: 'pages.component3.activities.solutions.description',
  },
  {
    icon: TestTube,
    titleKey: 'pages.component3.activities.pilots.title',
    descriptionKey: 'pages.component3.activities.pilots.description',
  },
  {
    icon: TrendingUp,
    titleKey: 'pages.component3.activities.resilience.title',
    descriptionKey: 'pages.component3.activities.resilience.description',
  },
  {
    icon: Cloud,
    titleKey: 'pages.component3.activities.mitigation.title',
    descriptionKey: 'pages.component3.activities.mitigation.description',
  },
];

const objectives = [
  { icon: Droplets, textKey: 'pages.component3.objectives.groundwater' },
  { icon: MapPin, textKey: 'pages.component3.objectives.pilots' },
  { icon: Zap, textKey: 'pages.component3.objectives.adaptation' },
];

export default function Component3Page() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="components.component3.title"
      subtitleKey="components.component3.description"
      backHref="/smas"
      backLabelKey="admin.back"
    >
      {/* Introduction */}
      <div className="mb-12">
        <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-smas-soft-green/10 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-7 h-7 text-smas-soft-green" />
            </div>
            <div>
              <h2 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-2">
                {t('pages.component3.introduction.title')}
              </h2>
              <p className="text-smas-charcoal/70 leading-relaxed">
                {t('pages.component3.introduction.content')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Activities */}
      <div className="mb-12">
        <h2 className="font-montserrat font-semibold text-xl text-smas-charcoal mb-6">
          {t('pages.component3.activities.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <Card key={idx} className="border-smas-sand-beige/50">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-smas-soft-green/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-smas-soft-green" />
                  </div>
                  <CardTitle className="font-montserrat text-base text-smas-charcoal">
                    {t(activity.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-smas-charcoal/60">
                    {t(activity.descriptionKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Objectives */}
      <div className="mb-12">
        <h2 className="font-montserrat font-semibold text-xl text-smas-charcoal mb-6">
          {t('pages.component3.objectives.title')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {objectives.map((objective, idx) => {
            const Icon = objective.icon;
            return (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-smas-soft-green/5 to-smas-aqua/10 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-smas-soft-green/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-smas-soft-green" />
                </div>
                <p className="text-sm text-smas-charcoal/70">
                  {t(objective.textKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Features */}
      <div>
        <h2 className="font-montserrat font-semibold text-xl text-smas-charcoal mb-6">
          {t('pages.component3.features.title')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {['Adaptation Solutions', 'Climate Resilience', 'Pilot Projects', 'Risk Mitigation'].map((feature, idx) => (
            <span 
              key={idx}
              className="px-4 py-2 bg-smas-soft-green/10 rounded-full text-sm font-medium text-smas-soft-green"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
