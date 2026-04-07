import { Report, getTestResult } from '@/actions';
import { Snippet } from '@nextui-org/snippet';
import { Card, CardBody } from '@nextui-org/card';
import { useTranslations } from 'next-intl';
import { title } from '@/components/primitives';
import { DomainPage } from './domain';
import { Domain } from '@bigfive-org/results';
import { getTranslations } from 'next-intl/server';
import { BarChart } from '@/components/bar-chart';
import { Link } from '@/navigation';
import { ReportLanguageSwitch } from './report-language-switch';
import { Alert } from '@/components/alert';
import { supportEmail } from '@/config/site';
import ShareBar from '@/components/share-bar';
import { DomainTabs } from './domain-tabs';
import { Chip } from '@nextui-org/react';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'results' });
  return {
    title: t('seo.title'),
    description: t('seo.description')
  };
}

interface ResultPageParams {
  params: { id: string };
  searchParams: { lang: string; showExpanded?: boolean };
}

export default async function ResultPage({
  params,
  searchParams
}: ResultPageParams) {
  let report;

  try {
    report = await getTestResult(params.id.substring(0, 24), searchParams.lang);
  } catch (error) {
    throw new Error('Could not retrieve report');
  }

  if (!report)
    return (
      <Alert title='Could not retrive report'>
        <>
          <p>We could not retrive the following id {params.id}.</p>
          <p>Please check that it is correct or contact us at {supportEmail}</p>
        </>
      </Alert>
    );

  return <Results report={report} showExpanded={searchParams.showExpanded} />;
}

interface ResultsProps {
  report: Report;
  showExpanded?: boolean;
}

const Results = ({ report, showExpanded }: ResultsProps) => {
  const t = useTranslations('results');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-1000">
      <div className='flex justify-between items-center mb-8'>
        <ReportLanguageSwitch
          language={report.language}
          availableLanguages={report.availableLanguages}
        />
        <Chip variant="flat" color="primary" className="font-bold">
          {new Date(report.timestamp).toLocaleDateString()}
        </Chip>
      </div>

      <Card className="glass-card mb-12 border-divider/30 shadow-2xl overflow-hidden">
        <CardBody className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-4">
              {t('theBigFive')}
            </h1>
            <p className="text-default-500 text-lg max-w-md">
              {t('important')} {t('saveResults')}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 bg-default-100/50 p-6 rounded-3xl border border-divider/20">
            <span className="text-xs font-bold uppercase tracking-widest text-default-400">Report Identification</span>
            <Snippet
              hideSymbol
              variant="flat"
              color='primary'
              className='font-mono font-bold text-lg'
            >
              {report.id}
            </Snippet>
            <div className="flex gap-2 mt-2">
               <ShareBar report={report} />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight">Trait Overview</h2>
          <div className="h-[2px] flex-grow bg-divider/20 rounded-full" />
        </div>
        <BarChart max={120} results={report.results} />
      </div>

      <div className="flex flex-col gap-4 mb-20">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-2xl font-display font-black uppercase tracking-tight">Detailed Analysis</h2>
           <Link href={`/compare/?id=${report.id}`} className='text-sm font-bold text-primary hover:underline'>
            {t('compare')} {t('toOthers')} →
          </Link>
        </div>
        <DomainTabs
          results={report.results}
          showExpanded={!!showExpanded}
          scoreText={t('score')}
        />
      </div>
    </div>
  );
};
