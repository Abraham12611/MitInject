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
  transpilePackages: [
    '@privy-io/react-auth',
    '@privy-io/wagmi-connector',
    'magic-sdk',
    '@magic-sdk/provider',
    '@magic-sdk/commons',
    '@magic-sdk/types'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      'magic-sdk': require.resolve('magic-sdk'),
      '@magic-sdk/provider': require.resolve('@magic-sdk/provider'),
      '@magic-sdk/commons': require.resolve('@magic-sdk/commons'),
      '@magic-sdk/types': require.resolve('@magic-sdk/types'),
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
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig