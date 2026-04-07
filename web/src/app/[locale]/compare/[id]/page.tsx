import { base64url } from '@/lib/helpers';
import { getTestResult } from '@/actions';
import { title } from '@/components/primitives';
import { DomainComparePage } from './domain';
import { BarChartCompare } from '@/components/bar-chart-generic';
import { Card, CardBody } from '@nextui-org/react';

interface ComparePageProps {
  params: {
    id: string;
  };
}

type Person = {
  id: string;
  name: string;
};

export default async function ComparePage({
  params: { id }
}: ComparePageProps) {
  const people: Person[] = base64url.decode(id);
  const reports = await Promise.all(
    people.map(async (person) => {
      const report = await getTestResult(person.id);
      if (!report) throw new Error('No report found');
      return {
        name: person.name,
        report
      };
    })
  );

  const categories = reports[0].report.results.map((result) => result.title);

  const series = reports.map(({ name, report }) => {
    return {
      name,
      data: report.results.map((result) => result.score)
    };
  });
  const getNamedFacets = (domain: string) =>
    reports.map((report) => {
      const domainResult = report.report.results.find(
        (result) => result.domain === domain
      );
      return {
        name: report.name,
        facets: domainResult?.facets
      };
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-1000">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-4">
          Comparison Overview
        </h1>
        <p className="text-default-500 text-lg max-w-2xl mx-auto">
          Comparing {reports.length} profiles across the five core personality domains.
        </p>
      </div>

      <Card className="glass-card mb-16 border-divider/30 shadow-2xl p-6 md:p-10">
        <CardBody className="overflow-visible">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display">Domain Summary</h2>
          </div>
          <BarChartCompare max={120} categories={categories} series={series} />
        </CardBody>
      </Card>

      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-px flex-grow bg-divider/20" />
          <h2 className="text-xl font-bold font-display text-default-400 uppercase tracking-[0.2em]">Detailed Analysis</h2>
          <div className="h-px flex-grow bg-divider/20" />
        </div>

        {reports[0].report.results.map((domain, idx) => (
          <DomainComparePage
            key={domain.domain}
            title={domain.title}
            shortDescription={domain.shortDescription}
            // @ts-ignore
            domain={getNamedFacets(domain.domain)}
          />
        ))}
      </div>
    </div>
  );
}
