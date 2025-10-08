// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  distDir: '.next', // default, safe
};

module.exports = nextConfig;
