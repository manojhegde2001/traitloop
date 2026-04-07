import { title } from '@/components/primitives';
import { useTranslations } from 'next-intl';
import { ComparePeople } from './compare-people';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

interface Props {
  params: { locale: string };
  searchParams: { id: string };
}

export default function ComparePage({
  params: { locale },
  searchParams: { id }
}: Props) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('getCompare');
  return (
    <div className='max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-1000'>
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-4">
          {t('title')}
        </h1>
        <p className='text-default-500 text-lg md:text-xl max-w-2xl'>
          {t('description1')}
        </p>
      </div>

      <Suspense fallback={<div className="h-64 flex items-center justify-center font-bold text-default-400">Loading comparison module...</div>}>
        <ComparePeople
          addPersonText={t('addPerson')}
          comparePeopleText={t('comparePeople')}
          paramId={id}
        />
      </Suspense>
    </div>
  );
}
