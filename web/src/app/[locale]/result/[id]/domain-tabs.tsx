'use client';

import { Button, ButtonGroup, Select, SelectItem, cn } from '@nextui-org/react';
import React from 'react';
import { Domain } from '@bigfive-org/results';
import { useState } from 'react';
import { DomainPage } from './domain';

interface DomainTabsProps {
  results: Domain[];
  showExpanded: boolean;
  scoreText: string;
}

export const DomainTabs = ({
  results,
  showExpanded,
  scoreText
}: DomainTabsProps) => {
  const [active, setActive] = useState('all');

  const domains = [
    { title: 'All', domain: 'all' },
    ...results.map((result) => ({ title: result.title, domain: result.domain }))
  ];

  const activeDomains =
    active === 'all'
      ? results
      : results.filter((result) => result.domain === active);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setActive(e.target.value);

  return (
    <div className="flex flex-col gap-12">
      <div className='flex justify-center my-4 sticky top-20 z-40'>
        <div className="glass p-2 rounded-full border-divider/30 shadow-xl flex gap-2">
          <ButtonGroup className='print:hidden hidden md:flex gap-1'>
            {domains.map(({ title, domain }) => (
              <Button
                key={domain}
                radius="full"
                onClick={() => setActive(domain)}
                className={cn(
                  "font-bold transition-all px-6",
                  active === domain 
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" 
                    : "bg-transparent hover:bg-default-100"
                )}
              >
                {title}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Select
          label='Select domain'
          className='max-w-xs md:hidden'
          items={domains}
          selectedKeys={[active]}
          onChange={handleSelectionChange}
          radius="full"
          variant="bordered"
        >
          {({ domain, title }) => <SelectItem key={domain}>{title}</SelectItem>}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeDomains.map((result: Domain, index: number) => (
          <div key={index} className="animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
            <DomainPage
              domain={result}
              scoreText={scoreText}
              showExpanded={showExpanded}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
