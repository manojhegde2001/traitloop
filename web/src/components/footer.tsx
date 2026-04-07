import { Link as NextUILink } from '@nextui-org/link';
import { Link } from '../navigation';

import {
  TwitterIcon,
  GithubIcon,
  LinkedInIcon,
  FacebookIcon,
  Logo
} from '@/components/icons';
import { siteConfig } from '@/config/site';

interface FooterProps {
  footerLinks: {
    label: string;
    href: string;
  }[];
}

export default function Footer({ footerLinks }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className='border-t border-divider/50 bg-default-50/50 backdrop-blur-lg'>
      <div className='max-w-7xl mx-auto py-16 px-6'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-10'>
          <div className='flex flex-col items-center md:items-start gap-4'>
            <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">
              T
            </div>
            <span className="text-2xl font-display font-black tracking-tighter">
              Trait Loop
            </span>
          </div>
            <p className="text-default-500 text-sm max-w-xs text-center md:text-left">
              Discover your true self with our scientifically validated Big Five personality assessment.
            </p>
          </div>

          <div className='flex gap-6'>
            <NextUILink isExternal href={siteConfig.links.twitter} aria-label='Twitter' className="text-default-400 hover:text-primary transition-colors">
              <TwitterIcon size={24} />
            </NextUILink>
            <NextUILink isExternal href={siteConfig.links.github} aria-label='Github' className="text-default-400 hover:text-foreground transition-colors">
              <GithubIcon size={24} />
            </NextUILink>
            <NextUILink isExternal href={siteConfig.links.linkedIn} aria-label='LinkedIn' className="text-default-400 hover:text-[#0077b5] transition-colors">
              <LinkedInIcon size={24} />
            </NextUILink>
            <NextUILink isExternal href={siteConfig.links.facebook} aria-label='Facebook' className="text-default-400 hover:text-[#1877f2] transition-colors">
              <FacebookIcon size={24} />
            </NextUILink>
          </div>
        </div>

        <div className='flex flex-wrap justify-center gap-x-8 gap-y-4 mt-12 py-8 border-t border-divider/40'>
          {footerLinks.map((item, index) => (
            <Link key={index} href={item.href} className='text-sm font-medium text-default-500 hover:text-primary transition-colors'>
              {item.label}
            </Link>
          ))}
        </div>

        <div className='flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-divider/40 text-xs text-default-400 uppercase tracking-widest font-bold'>
          <div>© {year} — Trait Loop</div>
          <div className="flex items-center gap-4">
            <span className="opacity-50 hover:opacity-100 cursor-help transition-opacity">Built for Growth</span>
            <span className="opacity-50 hover:opacity-100 cursor-help transition-opacity">Privacy Focused</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
