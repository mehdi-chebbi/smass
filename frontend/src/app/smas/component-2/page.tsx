'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, Users, Globe2, Scale, ClipboardList, Landmark, GitCompare } from 'lucide-react';

const activities = [
  {
    icon: FileText,
    titleKey: 'pages.component2.activities.policy.title',
    descriptionKey: 'pages.component2.activities.policy.description',
  },
  {
    icon: Globe2,
    titleKey: 'pages.component2.activities.framework.title',
    descriptionKey: 'pages.component2.activities.framework.description',
  },
  {
    icon: Scale,
    titleKey: 'pages.component2.activities.governance.title',
    descriptionKey: 'pages.component2.activities.governance.description',
  },
  {
    icon: ClipboardList,
    titleKey: 'pages.component2.activities.planning.title',
    descriptionKey: 'pages.component2.activities.planning.description',
  },
];

const objectives = [
  { icon: Landmark, textKey: 'pages.component2.objectives.sap' },
  { icon: GitCompare, textKey: 'pages.component2.objectives.integration' },
  { icon: Users, textKey: 'pages.component2.objectives.cooperation' },
];

export default function Component2Page() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="components.component2.title"
      subtitleKey="components.component2.description"
      backHref="/smas"
      backLabelKey="admin.back"
    >
      {/* Introduction */}
      <div className="mb-12">
        <div className="bg-white rounded-xl p-6 border border-smas-sand-beige/50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-smas-earth-brown/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-smas-earth-brown" />
            </div>
            <div>
              <h2 className="font-montserrat font-semibold text-lg text-smas-charcoal mb-2">
                {t('pages.component2.introduction.title')}
              </h2>
              <p className="text-smas-charcoal/70 leading-relaxed">
                {t('pages.component2.introduction.content')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Activities */}
      <div className="mb-12">
        <h2 className="font-montserrat font-semibold text-xl text-smas-charcoal mb-6">
          {t('pages.component2.activities.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <Card key={idx} className="border-smas-sand-beige/50">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-smas-earth-brown/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-smas-earth-brown" />
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
          {t('pages.component2.objectives.title')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {objectives.map((objective, idx) => {
            const Icon = objective.icon;
            return (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-smas-earth-brown/5 to-smas-sand-beige/20 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-smas-earth-brown/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-smas-earth-brown" />
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
          {t('pages.component2.features.title')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {['Policy Development', 'Transboundary Framework', 'Governance Mechanisms', 'Joint Management Plans'].map((feature, idx) => (
            <span 
              key={idx}
              className="px-4 py-2 bg-smas-earth-brown/10 rounded-full text-sm font-medium text-smas-earth-brown"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
