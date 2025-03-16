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
      '@magic-sdk/types',
      '@trezor/connect-web',
      '@trezor/connect',
      '@trezor/transport',
      '@trezor/utils',
      '@trezor/protocol',
      '@trezor/blockchain-link',
      '@trezor/device-utils'
    ],
    webpack: (config, { isServer }) => {
      // Polyfills for node modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        constants: require.resolve('constants-browserify'),
      };

      // Handle Trezor dependencies
      config.resolve.alias = {
        ...config.resolve.alias,
        '@trezor/transport/lib/types/messages': '@trezor/transport/lib/types',
        '@trezor/transport': '@trezor/transport/lib',
        '@trezor/transport/messages.json': '@trezor/transport/lib/messages.json',
        'magic-sdk': require.resolve('magic-sdk'),
        '@magic-sdk/provider': require.resolve('@magic-sdk/provider'),
        '@magic-sdk/commons': require.resolve('@magic-sdk/commons'),
        '@magic-sdk/types': require.resolve('@magic-sdk/types'),
      };

      // Add externals for node modules
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          'fs': false,
          'net': false,
          'tls': false,
          'child_process': false,
        };
      }

      // Add rule for handling .proto files
      config.module.rules.push({
        test: /\.proto$/,
        type: 'asset/source',
      });

      return config;
    },
    experimental: {
      esmExternals: 'loose',
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }

  module.exports = nextConfig