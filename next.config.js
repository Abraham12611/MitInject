/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    loader: 'default',
    path: '',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unavatar.io',
        pathname: '/twitter/**',
      },
    ],
  },
  transpilePackages: ['@privy-io/react-auth', '@privy-io/wagmi-connector'],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      'magic-sdk': false,
      '@magic-sdk/provider': false,
      '@magic-sdk/types': false,
    };
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.js': ['babel-loader'],
        '*.jsx': ['babel-loader'],
        '*.ts': ['ts-loader'],
        '*.tsx': ['ts-loader']
      }
    }
  }
}

module.exports = nextConfig