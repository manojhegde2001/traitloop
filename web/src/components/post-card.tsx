import { Card, CardFooter, CardBody, Chip } from '@nextui-org/react';
import { Avatar } from '@nextui-org/avatar';
import { Image } from '@nextui-org/image';
import { ArrowRightIcon } from '@/components/icons';
import { format, parseISO } from 'date-fns';
import { Post } from 'contentlayer/generated';
import { Link } from '@/navigation';
import { calculateReadingTime } from '@/lib/helpers';

export function PostCard(post: Post) {
  const readingTime = calculateReadingTime(post.body.raw);
  
  return (
    <Link href={post.url} className="block h-full group">
      <Card
        isPressable
        className='h-full border-divider/20 bg-background/40 backdrop-blur-md shadow-lg hover:shadow-primary/10 transition-all duration-500 overflow-hidden'
      >
        <CardBody className='p-0 overflow-hidden relative'>
          <Image
            removeWrapper
            className='w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700'
            src={post.image}
            alt={post.title}
          />
          <div className="absolute top-4 right-4 z-20">
             <Chip 
               size="sm" 
               className="bg-black/40 backdrop-blur-md text-white border-white/20" 
               variant="bordered"
             >
               {readingTime} min read
             </Chip>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <time
              className='text-xs font-bold uppercase tracking-widest text-primary opacity-80'
              dateTime={post.date}
              suppressHydrationWarning
            >
              {format(parseISO(post.date), 'MMM d, yyyy')}
            </time>
            <h3 className='text-2xl font-display font-black tracking-tight group-hover:text-primary transition-colors'>
              {post.title}
            </h3>
            <p className='text-default-500 line-clamp-3 text-sm leading-relaxed'>
              {post.description}
            </p>
          </div>
        </CardBody>
        <CardFooter className='px-6 py-4 border-t border-divider/10 bg-default-50/30 flex justify-between items-center'>
          <div className="flex items-center gap-3">
            <Avatar 
              size='sm' 
              src={post.author?.avatar} 
              className="border-2 border-primary/20"
            />
            <span className="text-sm font-bold text-default-600 truncate max-w-[120px]">
              {post.author?.name || 'Trait Loop Team'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
            Read <ArrowRightIcon size={16} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
