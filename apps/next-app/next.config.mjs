/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'img.clerk.com',
        protocol: 'https'
      },
      {
        hostname: 'utfs.io',
        protocol: 'https'
      },
      {
        hostname: 'picsum.photos',
        protocol: 'https'
      }
    ]
  }
}

export default nextConfig
