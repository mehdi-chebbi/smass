'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Users, BarChart3, MapPin } from 'lucide-react';

const statistics = [
  {
    icon: Droplets,
    value: '180+',
    labelKey: 'water.statistics.monitoringWells',
    labelDefault: 'Monitoring Wells',
  },
  {
    icon: Users,
    value: '4.5M',
    labelKey: 'water.statistics.population',
    labelDefault: 'Population Served',
  },
  {
    icon: BarChart3,
    value: '85%',
    labelKey: 'water.statistics.waterQuality',
    labelDefault: 'Water Quality Index',
  },
  {
    icon: MapPin,
    value: '200,000+',
    labelKey: 'water.statistics.coverage',
    labelDefault: 'km² Coverage',
  },
];

const keyActivities = [
  {
    title: 'Extensive Monitoring Network',
    description: 'Operating the largest network of monitoring wells in the SMAS region, tracking aquifer conditions across vast territories.',
  },
  {
    title: 'Desert Water Management',
    description: 'Developing specialized approaches for sustainable groundwater use in arid and semi-arid zones.',
  },
  {
    title: 'Transboundary Cooperation',
    description: 'Active collaboration with Senegal on shared aquifer management and cross-border water initiatives.',
  },
  {
    title: 'Urban Water Supply Support',
    description: 'Supporting major urban centers with sustainable groundwater supply planning and management.',
  },
];

export default function MauritaniaPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="water.countries.mauritania.name"
      subtitleKey="water.countries.mauritania.description"
      backHref="/water"
      backLabelKey="water.label"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-smas-sand-beige/50">
            <CardContent className="p-6">
              <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-4">
                Key Statistics
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {statistics.map((stat, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-smas-off-white">
                    <div className="w-12 h-12 rounded-full bg-smas-deep-blue/10 flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-6 h-6 text-smas-deep-blue" />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-2xl text-smas-deep-blue">
                        {stat.value}
                      </div>
                      <div className="text-sm text-smas-charcoal/60">
                        {stat.labelDefault}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-smas-sand-beige/50">
            <CardContent className="p-6">
              <h2 className="font-montserrat font-bold text-xl text-smas-charcoal mb-4">
                Key Activities
              </h2>
              <div className="space-y-4">
                {keyActivities.map((activity, index) => (
                  <div key={index} className="p-4 rounded-lg border border-smas-sand-beige/50 hover:border-smas-aqua/50 transition-colors">
                    <h3 className="font-semibold text-smas-charcoal mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-smas-charcoal/70">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border border-smas-sand-beige/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-smas-deep-blue/10 flex items-center justify-center">
                  <span className="text-2xl">🇲🇷</span>
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-smas-charcoal">
                    {t('water.countries.mauritania.name')}
                  </h3>
                  <p className="text-sm text-smas-charcoal/60">West Africa</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-smas-charcoal/70">
                  <MapPin className="w-4 h-4" />
                  <span>Nouakchott (Capital)</span>
                </div>
                <div className="flex items-center gap-2 text-smas-charcoal/70">
                  <Users className="w-4 h-4" />
                  <span>~4.5 million population</span>
                </div>
                <div className="flex items-center gap-2 text-smas-charcoal/70">
                  <Droplets className="w-4 h-4" />
                  <span>SMAS coverage: Southern regions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-smas-deep-blue to-smas-deep-blue/90 text-white">
            <CardContent className="p-6">
              <h3 className="font-montserrat font-semibold text-lg mb-3">
                Project Highlights
              </h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-smas-aqua rounded-full mt-2 flex-shrink-0" />
                  <span>Largest SMAS coverage area by country</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-smas-aqua rounded-full mt-2 flex-shrink-0" />
                  <span>OMVS partnership for Senegal River coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-smas-aqua rounded-full mt-2 flex-shrink-0" />
                  <span>Critical groundwater reliance for urban centers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-smas-aqua rounded-full mt-2 flex-shrink-0" />
                  <span>Desert adaptation pilot projects</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
