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
      '@trezor/device-utils',
      '@injectivelabs/wallet-ts',
      '@injectivelabs/sdk-ts',
      '@injectivelabs/networks',
      '@injectivelabs/utils',
      '@injectivelabs/ts-types',
      '@injectivelabs/wallet-trezor',
      '@injectivelabs/wallet-strategy'
    ],
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
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

        // Add rule for .proto files
        config.module.rules.push({
          test: /\.proto$/,
          type: 'asset/source'
        });

        // Add rule for JSON files
        config.module.rules.push({
          test: /\.json$/,
          type: 'json'
        });

        // Configure aliases for Trezor packages
        config.resolve.alias = {
          ...config.resolve.alias,
          '@trezor/transport/lib/types/messages': require.resolve('@trezor/transport/lib/types'),
          '@trezor/transport': require.resolve('@trezor/transport'),
          '@trezor/connect': require.resolve('@trezor/connect-web'),
          '@trezor/utils': require.resolve('@trezor/utils'),
          '@trezor/protocol': require.resolve('@trezor/protocol'),
          '@trezor/blockchain-link': require.resolve('@trezor/blockchain-link'),
          '@trezor/device-utils': require.resolve('@trezor/device-utils'),
          '@trezor/connect/lib/index': require.resolve('@trezor/connect-web'),
        };

        // Add specific rule for handling .d.ts files
        config.module.rules.push({
          test: /\.d\.ts$/,
          loader: 'ignore-loader'
        });

        // Add an empty module for the problematic import
        config.resolve.alias['@trezor/transport/lib/types/messages'] =
          require.resolve('./src/utils/empty-module.js');
      }

      return config;
    },
    experimental: {
      esmExternals: 'loose',
      externalDir: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }

  module.exports = nextConfig