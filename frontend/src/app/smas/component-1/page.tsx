'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Database, LineChart, GitBranch, Waves, Map, BarChart3, FileText } from 'lucide-react';

const activities = [
  {
    icon: Database,
    titleKey: 'pages.component1.activities.dataCollection.title',
    descriptionKey: 'pages.component1.activities.dataCollection.description',
  },
  {
    icon: LineChart,
    titleKey: 'pages.component1.activities.monitoring.title',
    descriptionKey: 'pages.component1.activities.monitoring.description',
  },
  {
    icon: GitBranch,
    titleKey: 'pages.component1.activities.interactions.title',
    descriptionKey: 'pages.component1.activities.interactions.description',
  },
  {
    icon: Map,
    titleKey: 'pages.component1.activities.mapping.title',
    descriptionKey: 'pages.component1.activities.mapping.description',
  },
];

const objectives = [
  { icon: Waves, textKey: 'pages.component1.objectives.aquifer' },
  { icon: BarChart3, textKey: 'pages.component1.objectives.database' },
  { icon: FileText, textKey: 'pages.component1.objectives.assessment' },
];

export default function Component1Page() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="components.component1.title"
      subtitleKey="components.component1.description"
      backHref="/smas"
      backLabelKey="admin.back"
    >
      {/* Introduction */}
      <div className="mb-12">
        <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-smas-deep-blue/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7 text-smas-deep-blue" />
            </div>
            <div>
              <h2 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-2">
                {t('pages.component1.introduction.title')}
              </h2>
              <p className="text-smas-charcoal/70 leading-relaxed">
                {t('pages.component1.introduction.content')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Activities */}
      <div className="mb-12">
        <h2 className="font-montserrat font-semibold text-xl text-smas-charcoal mb-6">
          {t('pages.component1.activities.title')}
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
          {t('pages.component1.objectives.title')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {objectives.map((objective, idx) => {
            const Icon = objective.icon;
            return (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-smas-deep-blue/5 to-smas-aqua/5 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-smas-deep-blue/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-smas-deep-blue" />
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
          {t('pages.component1.features.title')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {['Hydrogeological Studies', 'Data Collection & Analysis', 'Monitoring Systems', 'River-Aquifer Interactions'].map((feature, idx) => (
            <span 
              key={idx}
              className="px-4 py-2 bg-smas-deep-blue/10 rounded-full text-sm font-medium text-smas-deep-blue"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
