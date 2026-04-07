import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@nextui-org/link';
import { button as buttonStyles } from '@nextui-org/theme';
import { title, subtitle } from '@/components/primitives';
import clsx from 'clsx';
import { FeaturesGrid } from '@/components/features-grid';
import {
  ExperimentIcon,
  GithubIcon,
  LanguageIcon,
  LogosOpensource,
  MoneyIcon,
  PlusLinearIcon
} from '@/components/icons';
import { ArrowRightIcon } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { PostCard } from '@/components/post-card';
import { SonarPulse } from '@/components/sonar-pulse';
import { Button } from '@nextui-org/button';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Chip, Tooltip } from '@nextui-org/react';
import NextLink from 'next/link';
import { Translated } from '@/components/translated';

interface Props {
  params: { locale: string };
}

export default async function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'frontpage' });
  const f = await getTranslations({ locale, namespace: 'facets' });

  const posts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 3);

  const features = [
    {
      title: t('cards.open.title'),
      description: t('cards.open.text'),
      icon: LogosOpensource({})
    },
    {
      title: t('cards.free.title'),
      description: t('cards.free.text'),
      icon: MoneyIcon({})
    },
    {
      title: t('cards.scientific.title'),
      description: t('cards.scientific.text'),
      icon: ExperimentIcon({})
    },
    {
      title: t('cards.translated.title'),
      description: t.raw('cards.translated.text'),
      icon: LanguageIcon({}),
      href: 'https://b5.translations.alheimsins.net/'
    }
  ];

  // Fallback to simple t() calls with HTML rendering to avoid t.rich static export issues
  const titleDescription = t('description.top').replace('<highlight>', '<span class="text-secondary">').replace('</highlight>', '</span>');
  const testsTakenString = t('tests_taken', { n: '4,000,000' }).replace('<highlight>', '<span class="text-primary">').replace('</highlight>', '</span>');


  return (
    <section className='relative overflow-hidden'>
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

      <div>
        <section className='flex flex-col items-center justify-center gap-8 py-12 md:py-24 max-w-5xl mx-auto'>
          <div className='flex relative z-20 flex-col gap-8 w-full text-center'>
            <div className='flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1]">
                <span 
                  className="text-gradient"
                  dangerouslySetInnerHTML={{ __html: titleDescription }}
                />
              </h1>
              <h2 className="text-lg md:text-2xl font-normal text-default-500 max-w-2xl mx-auto leading-relaxed">
                {t('description.info')}
              </h2>
            </div>

            <div className='flex flex-col md:flex-row items-center gap-6 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200'>
              <Button
                as={Link}
                href='/test'
                className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all"
                radius="full"
                endContent={<ArrowRightIcon size={20} />}
              >
                {t('call_to_action')}
              </Button>
              <Button
                as={Link}
                isExternal
                href={siteConfig.links.github}
                className="h-14 px-8 text-lg font-bold glass hover:bg-default-100/50 transition-all"
                radius="full"
                variant="bordered"
                startContent={<GithubIcon size={22} />}
              >
                GitHub
              </Button>
            </div>
          </div>

          <div className='font-medium text-default-400 block max-w-full text-center tracking-wide uppercase text-xs sm:text-sm animate-in fade-in duration-1000 delay-500'>
            <span className="opacity-70">{t('no_registration')}</span>
          </div>
        </section>

        <div className='mt-12 mx-2 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-8 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-display">{feature.title}</h3>
                <p className="text-default-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className='relative mt-24 mb-12'>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 -skew-y-3 -z-10" />
        <div className='max-w-4xl mx-auto py-16 px-8 text-center glass rounded-3xl border-divider/40 shadow-2xl animate-in fade-in zoom-in duration-1000'>
          <h2 
            className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 italic"
            dangerouslySetInnerHTML={{ __html: testsTakenString }}
          />
          <p className="text-default-400 font-medium uppercase tracking-[0.2em] text-sm">
            Profiles Generated Globally
          </p>
        </div>
      </section>

      <div className='mt-32 max-w-5xl mx-auto px-6 text-center'>
        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight mb-8">
          {t('compare.title')}
        </h2>
        
        <div className='max-w-2xl mx-auto'>
          <p className='text-lg md:text-xl font-normal text-default-500 leading-relaxed'>
            {t('compare.text1')} {t('compare.text2')}
          </p>
        </div>

        <div className='h-80 md:h-[450px] mt-24 flex items-center justify-center relative translate-x-[-15px]'>
          <SonarPulse
            color='var(--nextui-secondary)'
            icon={
              <Tooltip
                showArrow
                color='secondary'
                content={t('call_to_action')}
                offset={10}
                radius='full'
              >
                <Button
                  isIconOnly
                  aria-label={t('call_to_action')}
                  className='z-50 w-24 h-24 bg-gradient-to-br from-primary to-secondary shadow-xl hover:scale-110 transition-transform'
                  radius='full'
                  as={Link}
                  href='/test'
                >
                  <PlusLinearIcon
                    className='text-white drop-shadow-md'
                    size={42}
                  />
                </Button>
              </Tooltip>
            }
          >
            <div
              className='absolute rounded-full'
              style={{
                width: '130px',
                top: 130 / 6,
                left: -120
              }}
            >
              {buildCircle([
                {
                  name: f('openness_to_experience.title'),
                  href: '/articles/openness_to_experience'
                },
                {
                  name: f('conscientiousness.title'),
                  href: '/articles/conscientiousness'
                },
                { name: f('extraversion.title'), href: '/articles/extraversion' },
                {
                  name: t('compare.action'),
                  href: '/compare/W3sibmFtZSI6Ik1hcnZpbiIsImlkIjoiNThhNzA2MDZhODM1YzQwMGM4YjM4ZTg0In0seyJuYW1lIjoiQXJ0aHVyIERlbnQiLCJpZCI6IjVlNTZiYTdhYjA5NjEzMDAwN2Q1ZDZkOCJ9LHsibmFtZSI6IkZvcmQgUGVyZmVjdCIsImlkIjoiNWRlYTllODhlMTA4Y2IwMDYyMTgzYWYzIn0seyJuYW1lIjoiU2xhcnRpYmFydGZhc3QiLCJpZCI6IjVlNTZiNjUwYjA5NjEzMDAwN2Q1ZDZkMCJ9XQ'
                },
                {
                  name: f('agreeableness.title'),
                  href: '/articles/agreeableness'
                },
                { name: f('neuroticism.title'), href: '/articles/neuroticism' }
              ]).map((e, idx) => (
                <div key={idx}>
                  <Button
                    key={idx}
                    name={e.name}
                    style={e.style}
                    className='absolute hidden md:inline-flex glass border-divider/40 hover:bg-secondary/10 hover:border-secondary transition-all font-bold'
                    variant='bordered'
                    as={Link}
                    href={e.href}
                    aria-label={e.name}
                    radius="full"
                  >
                    {e.name}
                  </Button>
                  <Chip
                    size='sm'
                    color='secondary'
                    variant='shadow'
                    aria-label={e.name}
                    classNames={{
                      base: 'absolute md:hidden rounded-full left-[85px]',
                      content: 'drop-shadow shadow-black text-white w-full'
                    }}
                    style={e.smallStyle}
                    as={Link}
                    href={e.href}
                  >
                    {e.name}
                  </Chip>
                </div>
              ))}
            </div>
          </SonarPulse>
        </div>
      </div>

      <div className='mt-44 max-w-6xl mx-auto px-6'>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="flex flex-col gap-2">
            <Link href='/articles' color='foreground' className="hover:opacity-100 transition-opacity">
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight tracking-tighter">Latest articles</h2>
            </Link>
            <p className="text-lg text-default-500 max-w-lg">
              Explore the science of psychology and stay updated with the latest in personality research.
            </p>
          </div>
          <Button
            as={NextLink}
            href='/articles'
            className="font-bold glass hover:bg-default-100/50"
            radius="full"
            variant="bordered"
            endContent={<ArrowRightIcon size={16} />}
          >
            Explore all
          </Button>
        </div>
        
        <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-32">
        <Translated />
      </div>
    </section>
  );
}
const buildCircle = (list: { name: string; href: string }[]) => {
  const num = list.length; // Number of Avatars
  const radius = 180; // Distance from center
  const start = -90; // Shift start from 0
  const slice = 360 / num;

  return list.map((item, idx) => {
    const rotate = slice * idx + start;
    return {
      name: item.name,
      href: item.href,
      style: {
        transform: `rotate(${rotate}deg) translate(${radius - 20}px) rotate(${-rotate}deg)`,
        width: '195px'
      },
      smallStyle: {
        transform: `rotate(${rotate}deg) translate(${radius - 60}px) rotate(${-rotate}deg)`
      }
    };
  });
};
