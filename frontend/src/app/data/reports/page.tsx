'use client';

import PageLayout from '@/components/PageLayout';
import { useI18n } from '@/i18n/context';
import { FileText, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reports = [
  {
    title: 'Annual Progress Report 2024',
    date: '2024-01-15',
    type: 'Annual Report',
    size: '2.5 MB',
  },
  {
    title: 'Hydrogeological Assessment',
    date: '2023-11-20',
    type: 'Technical Report',
    size: '5.8 MB',
  },
  {
    title: 'Groundwater Quality Analysis',
    date: '2023-09-10',
    type: 'Study',
    size: '1.2 MB',
  },
  {
    title: 'Transboundary Cooperation Framework',
    date: '2023-06-30',
    type: 'Policy Document',
    size: '890 KB',
  },
  {
    title: 'Monitoring System Implementation',
    date: '2023-04-15',
    type: 'Technical Report',
    size: '3.4 MB',
  },
];

export default function ReportsPage() {
  const { t } = useI18n();

  return (
    <PageLayout
      titleKey="pages.reports.title"
      subtitleKey="pages.reports.subtitle"
      backHref="/data"
      backLabelKey="nav.data.label"
    >
      <div className="bg-white rounded-xl border border-smas-sand-beige/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-smas-sand-beige/30">
            <tr>
              <th className="text-left px-6 py-4 font-montserrat font-semibold text-smas-charcoal">
                Document
              </th>
              <th className="text-left px-6 py-4 font-montserrat font-semibold text-smas-charcoal hidden md:table-cell">
                Type
              </th>
              <th className="text-left px-6 py-4 font-montserrat font-semibold text-smas-charcoal hidden lg:table-cell">
                Date
              </th>
              <th className="text-right px-6 py-4 font-montserrat font-semibold text-smas-charcoal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="border-t border-smas-sand-beige/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-smas-deep-blue" />
                    <div>
                      <p className="font-medium text-smas-charcoal">{report.title}</p>
                      <p className="text-sm text-smas-charcoal/50 md:hidden">{report.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="px-2 py-1 bg-smas-sand-beige/30 rounded text-sm text-smas-charcoal/70">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-smas-charcoal/60 hidden lg:table-cell">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">{report.size}</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}
