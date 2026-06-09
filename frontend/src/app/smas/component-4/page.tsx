'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Share2, Globe, MessageSquare, BookMarked, Network, Lightbulb } from 'lucide-react';

const activities = [
  {
    icon: GraduationCap,
    titleKey: 'pages.component4.activities.training.title',
    descriptionKey: 'pages.component4.activities.training.description',
  },
  {
    icon: Share2,
    titleKey: 'pages.component4.activities.knowledge.title',
    descriptionKey: 'pages.component4.activities.knowledge.description',
  },
  {
    icon: MessageSquare,
    titleKey: 'pages.component4.activities.communication.title',
    descriptionKey: 'pages.component4.activities.communication.description',
  },
  {
    icon: Globe,
    titleKey: 'pages.component4.activities.platform.title',
    descriptionKey: 'pages.component4.activities.platform.description',
  },
];

const objectives = [
  { icon: BookMarked, textKey: 'pages.component4.objectives.capacity' },
  { icon: Network, textKey: 'pages.component4.objectives.network' },
  { icon: Lightbulb, textKey: 'pages.component4.objectives.innovation' },
];

export default function Component4Page() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="components.component4.title"
      subtitleKey="components.component4.description"
      backHref="/smas"
      backLabelKey="admin.back"
    >
      {/* Introduction */}
      <div className="mb-12">
        <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-smas-aqua/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-smas-aqua" />
            </div>
            <div>
              <h2 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-2">
                {t('pages.component4.introduction.title')}
              </h2>
              <p className="text-smas-charcoal/70 leading-relaxed">
                {t('pages.component4.introduction.content')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Activities */}
      <div className="mb-12">
        <h2 className="font-montserrat font-semibold text-xl text-smas-charcoal mb-6">
          {t('pages.component4.activities.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <Card key={idx} className="border-smas-sand-beige/50">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-smas-aqua/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-smas-aqua" />
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
          {t('pages.component4.objectives.title')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {objectives.map((objective, idx) => {
            const Icon = objective.icon;
            return (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-smas-aqua/5 to-smas-deep-blue/5 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-smas-aqua/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-smas-aqua" />
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
          {t('pages.component4.features.title')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {['Training Programs', 'Knowledge Sharing', 'Communication Strategy', 'Regional Platform'].map((feature, idx) => (
            <span 
              key={idx}
              className="px-4 py-2 bg-smas-aqua/10 rounded-full text-sm font-medium text-smas-aqua"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
