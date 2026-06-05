/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sienna-duck-658240.hostingersite.com',
      },
    ],
  },
};

module.exports = nextConfig;