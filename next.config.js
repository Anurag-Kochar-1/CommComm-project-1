/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'ih1.redbubble.net',
      "i.ytimg.com"
    ],
  },
}

module.exports = nextConfig
