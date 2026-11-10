'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import Arrow from './Arrow';
import { header } from '@/data/site';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Pages WITHOUT a dark hero behind the header — header always in "scrolled" style
  const hasHero = pathname === '/' || pathname === '';

  // Effective state: on non-hero pages, always treat as scrolled
  const isLight = hasHero && !scrolled; // light = transparent + white text over hero
  const isOpaque = !isLight; // opaque = glass + foreground text

  useEffect(() => {
    // Hydration guard: the theme toggle renders a different icon once
    // next-themes knows the resolved theme, so the first client render must
    // still match the server output. This is the one legitimate synchronous
    // setState in an effect here, not a cascading-render mistake.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isOpaque ? 'glass py-4' : 'on-photo py-6'
      }`}
      style={{
        borderBottom: isOpaque ? '1px solid var(--line)' : 'none',
        color: isOpaque ? 'var(--fg)' : '#ffffff',
      }}
    >
      {/* 1.4.3 / 1.4.11 — over the hero the header sits on sky. Measured on the
          real photographs at 375, 768 and 1440 without this band: the CTA label
          3.3–4.9:1, the outlines 2.3–3.1:1, the focus ring 1.2–1.8:1. A 45% ink
          band under the controls lifts them to ≥ 7.5:1 (text), ≥ 4.3:1
          (outlines) and ≥ 3.4:1 (on-dark focus ring). It fades out below the
          header so the photograph is not visibly cut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[150%] transition-opacity duration-500"
        style={{
          opacity: isLight ? 1 : 0,
          background:
            'linear-gradient(to bottom, rgba(14,14,12,0.45) 0%, rgba(14,14,12,0.45) 60%, rgba(14,14,12,0) 100%)',
        }}
      />
      <div className="mx-auto max-w-[1880px] px-3 sm:px-5 md:px-10 flex items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          aria-label={header.logoLabel}
          className="flex items-center gap-3 group shrink-0"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            className="transition-transform group-hover:rotate-90 duration-700"
          >
            <path
              d="M16 2 L28 14 L28 30 L4 30 L4 14 Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path d="M16 2 L16 30" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="16" cy="20" r="1.5" fill="currentColor" />
          </svg>
          <div className="leading-tight">
            <div className="display-serif text-lg md:text-xl hidden sm:block">
              {header.wordmark}
            </div>
            <div className="label-mono text-[0.55rem] opacity-80 hidden sm:block">
              {header.wordmarkSub}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1.3.1 — the single call to action is the site's navigation. Wrapping
              it in a <nav> is what turns it into a landmark a screen-reader user
              can jump to; the theme toggle stays outside, because a preference
              control is not a way of getting somewhere. */}
          <nav aria-label={header.navLabel}>
            {/* The inversion is CSS so keyboard focus gets it too — it used to
                be written by onMouseEnter/onMouseLeave, which only a pointer
                can trigger. */}
            <Link
              href={header.cta.href}
              className={`group rounded-xs inline-flex items-center gap-2 sm:gap-3 display-serif italic text-lg sm:text-xl h-11 px-3 sm:px-5 md:px-6 py-2 border transition-colors duration-500 whitespace-nowrap ${
                isOpaque
                  ? 'border-(--fg) hover:bg-(--fg) hover:text-(--bg) focus-visible:bg-(--fg) focus-visible:text-(--bg)'
                  : 'border-white/65 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black'
              }`}
            >
              {header.cta.label}
              <Arrow
                size={24}
                className="transition-transform duration-500 group-hover:translate-x-1 group-focus-visible:translate-x-1"
              />
            </Link>
          </nav>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-11 h-11 rounded-xs flex items-center justify-center border transition shrink-0 ${
                isOpaque
                  ? 'border-(--line-strong) hover:bg-(--bg-alt)'
                  : 'border-white/65 hover:opacity-70'
              }`}
              aria-label={header.themeToggleLabel}
            >
              {theme === 'dark' ? (
                <Sun size={22} strokeWidth={1.2} aria-hidden="true" />
              ) : (
                <Moon size={22} strokeWidth={1.2} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
