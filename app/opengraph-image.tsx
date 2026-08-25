import { ImageResponse } from 'next/og';
import { ogImage } from '@/data/site';

// The Edge Runtime is deprecated in Next.js 16; this route builds a PNG with
// next/og, which the Node runtime handles just as well.
export const runtime = 'nodejs';
export const alt = ogImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Copy lives in data/site.ts — see `ogImage`.
const HEADLINE_LEFT = ogImage.headlineLeft;
const HEADLINE_ITALIC_ACCENT = ogImage.headlineItalicAccent;
const HEADLINE_RIGHT_PREFIX = ogImage.headlineRightPrefix;
const HEADLINE_ITALIC_END = ogImage.headlineItalicEnd;
const LOCATION = ogImage.location;
const FACTS = ogImage.facts;
const URL = ogImage.url;

// Helper — ładuje czcionkę z Google Fonts z subsetem do podanego tekstu
async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const fontUrl = css.match(/src:\s*url\((.+?)\)\s*format/)?.[1];
  if (!fontUrl) throw new Error(`Nie znaleziono URL czcionki: ${family}`);
  const fontRes = await fetch(fontUrl);
  return fontRes.arrayBuffer();
}

export default async function OG() {
  // Wszystkie znaki które wystąpią w obrazie — Google Fonts zwróci tylko te
  const charset = `${HEADLINE_LEFT} ${HEADLINE_ITALIC_ACCENT} ${HEADLINE_RIGHT_PREFIX} ${HEADLINE_ITALIC_END} ${LOCATION} ${FACTS} ${URL}`;

  const [cormorantRegular, cormorantItalic] = await Promise.all([
    loadGoogleFont('Cormorant+Garamond:wght@500', charset),
    loadGoogleFont('Cormorant+Garamond:ital,wght@1,500', charset),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background:
            'linear-gradient(135deg, #1a0e08 0%, #2a1810 35%, #3a2818 70%, #2a1810 100%)',
          color: 'white',
          fontFamily: 'Cormorant',
          position: 'relative',
        }}
      >
        {/* Subtelny vignette — accent gold w centrum, ciemniej na krawędziach */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, rgba(212,167,106,0.10) 0%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {/* GÓRA — label lokalizacji */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 24,
            letterSpacing: '0.25em',
            fontFamily: 'sans-serif',
            opacity: 0.88,
          }}
        >
          {/* Drawn, not typed. As a "●" glyph this needed a font neither of the
              two subsets above carries, so Satori went looking for one at build
              time and logged a failed download for a 12 px dot. */}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: '#d4a76a',
            }}
          />
          <span>{LOCATION}</span>
        </div>

        {/* ŚRODEK — nagłówek */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            fontSize: 120,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          <div style={{ display: 'flex' }}>
            <span>{HEADLINE_LEFT}&nbsp;</span>
            <span
              style={{
                fontFamily: 'CormorantItalic',
                fontStyle: 'italic',
                color: '#d4a76a',
              }}
            >
              {HEADLINE_ITALIC_ACCENT}
            </span>
          </div>
          <div style={{ display: 'flex' }}>
            <span>{HEADLINE_RIGHT_PREFIX}&nbsp;</span>
            <span
              style={{
                fontFamily: 'CormorantItalic',
                fontStyle: 'italic',
              }}
            >
              {HEADLINE_ITALIC_END}
            </span>
          </div>
        </div>

        {/* DÓŁ — fakty i URL */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.18)',
            fontSize: 28,
          }}
        >
          <span style={{ opacity: 0.92 }}>{FACTS}</span>
          <span
            style={{
              fontFamily: 'sans-serif',
              fontSize: 20,
              opacity: 0.7,
              letterSpacing: '0.05em',
            }}
          >
            {URL}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Cormorant',
          data: cormorantRegular,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'CormorantItalic',
          data: cormorantItalic,
          style: 'italic',
          weight: 500,
        },
      ],
    }
  );
}