/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      }
    ]
  },
}

module.exports = nextConfig
