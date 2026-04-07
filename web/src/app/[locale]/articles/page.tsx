import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { PostCard } from '@/components/post-card';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Chip } from '@nextui-org/react';

interface Props {
  params: { locale: string };
}

export default function ArticlesPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className='max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-1000'>
      <section className='mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8'>
        <div className="flex flex-col gap-4">
          <Chip 
            variant="flat" 
            color="primary" 
            className="w-fit font-bold uppercase tracking-widest text-[10px]"
          >
            Insights & Research
          </Chip>
          <h1 className='font-display font-black text-4xl md:text-6xl tracking-tight'>
            Personality Articles
          </h1>
          <p className='text-default-500 text-lg md:text-xl max-w-2xl'>
            Explore the latest findings in personality psychology and human behavior research.
          </p>
        </div>
      </section>

      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post, idx) => (
          <div 
            key={idx} 
            className="animate-in fade-in slide-in-from-bottom-8 duration-700" 
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <PostCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}
