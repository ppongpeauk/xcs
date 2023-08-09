/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/roblox/users/:slug*',
        destination: 'https://users.roblox.com/:slug*'
      },
      {
        source: '/api/v1/roblox/groups/:slug*',
        destination: 'https://groups.roblox.com/:slug*'
      },
      {
        source: '/api/v1/roblox/games/:slug*',
        destination: 'https://games.roblox.com/:slug*'
      },
      {
        source: '/api/v1/roblox/thumbnails/:slug*',
        destination: 'https://thumbnails.roblox.com/:slug*'
      },
      {
        source: '/api/v1/ip-api/:slug*',
        destination: 'http://ip-api.com/:slug*'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true
      },
      {
        source: '/signup',
        destination: '/auth/signup',
        permanent: true
      },
      {
        source: '/logout',
        destination: '/auth/logout',
        permanent: true
      },
      {
        source: '/platform',
        destination: '/platform/home',
        permanent: true
      },
      {
        source: '/@:username*',
        destination: '/platform/profile/:username*',
        permanent: false
      },
      {
        source: '/AxesysAPI/:slug*',
        destination: '/api/v1/axesys/:slug*',
        permanent: false
      },
      {
        source: '/api/v1/AxesysAPI/:slug*',
        destination: '/api/v1/axesys/:slug*',
        permanent: false
      }
    ];
  }
});