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
  }
}

module.exports = nextConfig
