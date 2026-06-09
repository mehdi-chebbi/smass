'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WorkWithUsPage() {
  const { t } = useI18n();

  const collaborationOptions = [
    {
      title: t('work.tenders.title'),
      description: t('work.tenders.description'),
      href: '/work-with-us/tenders',
      icon: FileText,
      gradient: 'from-smas-deep-blue to-smas-aqua',
    },
  ];

  return (
    <PageLayout titleKey="work.title" subtitleKey="work.subtitle">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collaborationOptions.map((option) => (
          <Card
            key={option.href}
            className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${option.gradient}`} />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-smas-deep-blue/10 rounded-lg">
                  <option.icon className="w-6 h-6 text-smas-deep-blue" />
                </div>
                <CardTitle className="text-xl font-montserrat text-smas-charcoal">
                  {option.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-smas-charcoal/70 mb-4">
                {option.description}
              </CardDescription>
              <Link href={option.href}>
                <Button className="w-full bg-smas-deep-blue hover:bg-smas-deep-blue/90 text-white">
                  {t('common.search')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
