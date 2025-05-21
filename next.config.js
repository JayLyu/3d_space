/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/3d_space',
  assetPrefix: '/3d_space/',
}

module.exports = nextConfig 