/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sienna-duck-658240.hostingersite.com',
      },
      {
        protocol: 'https',
        hostname: 'candyimporter.co.il',
      },
    ],
  },
};

module.exports = nextConfig;
