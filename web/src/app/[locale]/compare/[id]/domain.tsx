'use client';

import { Facet } from '@bigfive-org/results';
import { BarChartCompare } from '@/components/bar-chart-generic';
import { Card, CardBody, Chip } from '@nextui-org/react';

interface DomainProps {
  title: string;
  shortDescription: string;
  domain: NamedScore[];
}

type NamedScore = {
  name: string;
  facets: Facet[];
};

export const DomainComparePage = ({
  title,
  shortDescription,
  domain
}: DomainProps) => {
  const categories = domain[0].facets.map((facet) => facet.title);
  const scores = domain.map((d) => ({
    name: d.name,
    data: d.facets.map((f) => f.score)
  }));

  return (
    <Card className="glass-card border-divider/30 shadow-xl overflow-visible">
      <CardBody className="p-8 md:p-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-display font-black tracking-tight" id={title}>
                {title}
              </h2>
              <p className="text-default-500 text-lg leading-relaxed max-w-3xl font-medium">
                {shortDescription}
              </p>
            </div>
            <Chip 
              variant="shadow" 
              color="primary" 
              className="font-bold py-4 px-3"
              radius="full"
            >
              Side-by-Side Analysis
            </Chip>
          </div>

          <div className="w-full h-px bg-divider/10" />

          <div className="mt-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h3 className="text-xl font-bold font-display uppercase tracking-wider text-default-400">Facet Breakdown</h3>
            </div>
            <BarChartCompare max={20} categories={categories} series={scores} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
