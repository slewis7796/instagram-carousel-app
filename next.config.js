/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/text-to-insta',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['*'],
    unoptimized: true
  }
};

module.exports = nextConfig;
