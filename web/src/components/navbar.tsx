'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Button
} from '@nextui-org/react';
import LocaleSwitcher from '@/components/locale-switcher';
import LocaleSwitcherFull from '@/components/locale-switcher-full';
import { Link } from '@nextui-org/link';

import { link as linkStyles } from '@nextui-org/theme';

import { siteConfig } from '@/config/site';
import clsx from 'clsx';

import { ThemeSwitch } from '@/components/theme-switch';
import { TwitterIcon, GithubIcon, Logo } from '@/components/icons';
import { Link as NextLink } from '../navigation';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface NavbarProps {
  navItems: { label: string; href: string }[];
  navMenuItems: { label: string; href: string }[];
}

export const Navbar = ({ navItems, navMenuItems }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  const isCurrentPath = (link: string): boolean => {
    if (link === '/') {
      return pathname === '/' || pathname === `/${locale}`;
    } else {
      return pathname.includes(link);
    }
  };

  return (
    <NextUINavbar
      maxWidth='xl'
      position='sticky'
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="glass sticky top-0 z-50 border-b border-divider/50"
    >
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink
            className='flex justify-start items-center gap-1'
            href='/'
            aria-label='Home'
          >
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:rotate-12 transition-transform">
                T
              </div>
              <p className="font-display font-black text-2xl tracking-tighter text-foreground ml-3 group-hover:translate-x-1 transition-transform">
                Trait Loop
              </p>
            </div>
          </NextLink>
        </NavbarBrand>
        <div className='hidden md:flex gap-4 justify-start ml-2'>
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-danger data-[active=true]:font-medium'
                )}
                data-active={isCurrentPath(item.href)}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className='hidden md:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='hidden sm:flex gap-2'>
          <Link isExternal href={siteConfig.links.twitter} aria-label='Twitter'>
            <TwitterIcon className='text-default-500' />
          </Link>
          <Link isExternal href={siteConfig.links.github} aria-label='Github'>
            <GithubIcon className='text-default-500' />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <LocaleSwitcherFull />
        </NavbarItem>
        <NavbarItem>
          <Button
            as={NextLink}
            className="bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-md hover:shadow-lg transition-all"
            href="/test"
            radius="full"
            variant="shadow"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='md:hidden basis-1 pl-4' justify='end'>
        <NavbarItem>
          <LocaleSwitcher />
        </NavbarItem>
        <NavbarItem>
          <Link isExternal href={siteConfig.links.github} aria-label='Github'>
            <GithubIcon className='text-default-500' />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className='w-10 h-full'>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                onClick={() => setIsMenuOpen(false)}
                href={item.href}
                data-active={isCurrentPath(item.href)}
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-danger data-[active=true]:font-medium !text-3xl py-2'
                )}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
