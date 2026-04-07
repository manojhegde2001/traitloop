import { format, parseISO } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { ChevronRightLinearIcon } from '@/components/icons';
import NextLink from 'next/link';
import { User } from '@nextui-org/user';
import { Link, Chip } from '@nextui-org/react';
import { Image } from '@nextui-org/image';
import { calculateReadingTime } from '@/lib/helpers';
import { ViewCounter } from '@/components/view-counter';
import { Suspense } from 'react';

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};

const PostLayout = async ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  
  const readingTime = calculateReadingTime(post.body.raw);

  return (
    <article className='w-full max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-1000'>
      <div className='flex items-center justify-between mb-8'>
        <Link
          as={NextLink}
          className='text-default-500 hover:text-primary transition-colors flex items-center gap-2 font-bold'
          href='/articles'
        >
          <ChevronRightLinearIcon
            className='rotate-180'
            size={18}
          />
          Back to Insights
        </Link>
        <div className="flex items-center gap-4 text-default-400 text-sm font-medium">
          <Suspense fallback={<span>...</span>}>
            <ViewCounter postId={post._id} />
          </Suspense>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      <header className='mb-12'>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
             <Chip color="primary" variant="flat" size="sm" className="font-bold uppercase tracking-widest text-[10px]">
               Research
             </Chip>
             <time className="text-default-400 text-sm font-medium" dateTime={post.date}>
               {format(parseISO(post.date), 'MMMM d, yyyy')}
             </time>
          </div>
          <h1 className='text-4xl md:text-6xl font-display font-black tracking-tight leading-tight'>
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 py-4 border-y border-divider/10">
            <User
              name={post.author?.name || 'Trait Loop Team'}
              description={post.author?.username || '@traitloop'}
              avatarProps={{
                src: post.author?.avatar,
                className: "border-2 border-primary/20"
              }}
              classNames={{
                name: "font-bold text-lg",
                description: "text-default-500"
              }}
            />
          </div>
        </div>
      </header>

      {post.image && (
        <div className='relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl border border-divider/20'>
          <Image
            removeWrapper
            src={post.image}
            alt={post.title}
            className='w-full aspect-[21/9] object-cover'
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div
        className='prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight
          prose-p:text-default-600 prose-p:leading-relaxed 
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-3xl prose-img:shadow-xl
          articlePage'
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
      
      <footer className="mt-20 pt-12 border-t border-divider/10">
        <div className="glass-card p-8 rounded-3xl border border-divider/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-2xl font-display font-black">Enjoyed this article?</h3>
            <p className="text-default-500">Take our free personality assessment to see how these traits apply to you.</p>
          </div>
          <NextLink href="/test">
            <button className="bg-primary text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              Take the Test
            </button>
          </NextLink>
        </div>
      </footer>
    </article>
  );
};

export default PostLayout;
