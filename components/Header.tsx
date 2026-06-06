'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import Arrow from './Arrow';

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
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isOpaque ? 'glass py-4' : 'py-6'
      }`}
      style={{
        borderBottom: isOpaque ? '1px solid var(--line)' : 'none',
        color: isOpaque ? 'var(--fg)' : '#ffffff',
      }}
    >
      <div className="mx-auto max-w-[1880px] px-5 md:px-10 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 group flex-shrink-0">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
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
            <div className="display-serif text-lg md:text-xl hidden sm:block">Dom w Mesznej</div>
            <div className="label-mono text-[0.55rem] opacity-60 hidden sm:block">
              Bez pośredników
            </div>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="/#kontakt"
            className="group rounded-sm inline-flex items-center gap-3 display-serif italic text-xl h-11 px-5 md:px-6 py-2  transition-colors duration-500 whitespace-nowrap"
            style={{
              border: `1px solid ${isOpaque ? 'var(--fg)' : 'rgba(255,255,255,0.65)'}`,
            }}
            onMouseEnter={(e) => {
              if (isOpaque) {
                e.currentTarget.style.backgroundColor = 'var(--fg)';
                e.currentTarget.style.color = 'var(--bg)';
              } else {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '';
            }}
          >
            Umów oglądanie
            <Arrow size={24} className="transition-transform duration-500 group-hover:translate-x-1" />
          </a>
                    {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-11 h-11 rounded-sm flex items-center justify-center transition-colors flex-shrink-0 hover:opacity-70"
              style={{
                border: `1px solid ${isOpaque ? 'var(--line-strong)' : 'rgba(255,255,255,0.55)'}`,
              }}
              aria-label="Przełącz motyw"
            >
              {theme === 'dark' ? (
                <Sun size={22} strokeWidth={1.2} />
              ) : (
                <Moon size={22} strokeWidth={1.2} />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
