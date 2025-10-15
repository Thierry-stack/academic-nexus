/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  distDir: '.next', // default, safe
};

module.exports = nextConfig;