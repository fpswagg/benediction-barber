/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Dashboard photo uploads (compressed in the browser first).
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
  images: {
    unoptimized: true,
  },
  // Demo site: keep it out of search engines.
  // No booking any more: old links go to the home page.
  async redirects() {
    return [{ source: '/reservation', destination: '/', permanent: false }]
  },
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  },
}

export default nextConfig
