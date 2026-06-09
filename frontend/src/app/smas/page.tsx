'use client';

import { useI18n } from '@/i18n/context';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Building2, Leaf, Users, ArrowRight } from 'lucide-react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

const components = [
  {
    id: 1,
    href: '/smas/component-1',
    icon: BookOpen,
    color: 'smas-deep-blue',
    titleKey: 'components.component1.shortTitle',
    descriptionKey: 'components.component1.description',
    features: ['Hydrogeological Studies', 'Data Collection & Analysis', 'Monitoring Systems', 'River-Aquifer Interactions']
  },
  {
    id: 2,
    href: '/smas/component-2',
    icon: Building2,
    color: 'smas-earth-brown',
    titleKey: 'components.component2.shortTitle',
    descriptionKey: 'components.component2.description',
    features: ['Policy Development', 'Transboundary Framework', 'Governance Mechanisms', 'Joint Management Plans']
  },
  {
    id: 3,
    href: '/smas/component-3',
    icon: Leaf,
    color: 'smas-soft-green',
    titleKey: 'components.component3.shortTitle',
    descriptionKey: 'components.component3.description',
    features: ['Adaptation Solutions', 'Climate Resilience', 'Pilot Projects', 'Risk Mitigation']
  },
  {
    id: 4,
    href: '/smas/component-4',
    icon: Users,
    color: 'smas-aqua',
    titleKey: 'components.component4.shortTitle',
    descriptionKey: 'components.component4.description',
    features: ['Training Programs', 'Knowledge Sharing', 'Communication Strategy', 'Regional Platform']
  }
];

export default function SMASOverviewPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-smas-off-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-smas-deep-blue via-smas-deep-blue/90 to-smas-aqua/80 py-20 md:py-28">
          <div className="section-padding">
            <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
              {t('components.title')}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              {t('components.subtitle')}
            </p>
          </div>
        </section>

        {/* Components Grid */}
        <section className="py-16 md:py-20">
          <div className="section-padding">
            <div className="grid md:grid-cols-2 gap-6">
              {components.map((component) => {
                const Icon = component.icon;
                return (
                  <Link key={component.id} href={component.href} className="group">
                    <Card className="h-full card-hover border-smas-sand-beige/50 hover:border-smas-deep-blue/30">
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-xl bg-${component.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-7 h-7 text-${component.color}`} />
                        </div>
                        <CardTitle className="font-montserrat text-xl text-smas-charcoal group-hover:text-smas-deep-blue transition-colors">
                          {t(component.titleKey)}
                        </CardTitle>
                        <CardDescription className="text-smas-charcoal/60 mt-2">
                          {t(component.descriptionKey)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {component.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-smas-sand-beige/30 rounded-full text-xs font-medium text-smas-charcoal/70"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-smas-deep-blue font-medium group-hover:translate-x-2 transition-transform">
                          {t('components.learnMore')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
