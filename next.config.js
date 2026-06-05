/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Netlify's @netlify/plugin-nextjs handles Image Optimization automatically.
  // No remote patterns needed — all images are local in /public/images/.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
