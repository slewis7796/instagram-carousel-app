/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/text-to-insta',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['*'],
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/text-to-insta',
        permanent: false,
      },
    ]
  },
};

module.exports = nextConfig;
