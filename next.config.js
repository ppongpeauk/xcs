/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/roblox/users/:slug*",
        destination: "https://users.roblox.com/:slug*",
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },
      {
        source: "/logout",
        destination: "/auth/logout",
        permanent: true,
      },
      {
        source: "/platform",
        destination: "/platform/home",
        permanent: true,
      },
      {
        source: "/AxesysAPI/:slug*",
        destination: "/api/v1/axesys/:slug*",
        permanent: false,
      },
      {
        source: "/api/v1/AxesysAPI/:slug*",
        destination: "/api/v1/axesys/:slug*",
        permanent: false,
      }
    ]
  },
}

module.exports = nextConfig
