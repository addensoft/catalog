/** @type {import('next').NextConfig} */
const nextConfig = {
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
