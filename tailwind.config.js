/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bone: '#f4f1ea',
        ink: '#0e0e0c',
        sage: '#6b7a5a',
        gold: '#b8935a',
        mist: '#e8e4dc',
        coal: '#1a1a18',
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.45em',
      },
    },
  },
  plugins: [],
};
