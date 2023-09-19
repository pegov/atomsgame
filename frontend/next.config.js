/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreBuildErrors: true,
  },
  webpack: (config, _) => {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 800,
        aggregateTimeout: 300,
      },
    }
  },
  env: {
    DEBUG: process.env.DEBUG === "1",

    PROXY: process.env.PROXY,

    ORIGIN_HTTP: process.env.ORIGIN_HTTP,
    ORIGIN_WS: process.env.ORIGIN_WS,
  }
}

module.exports = nextConfig
