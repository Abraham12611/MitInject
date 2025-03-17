/** @type {import('next').NextConfig} */
const IgnoreTrezorPlugin = require('./src/utils/webpack-ignore-plugin');
const path = require('path');

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
      '@injectivelabs/wallet-ts',
      '@injectivelabs/sdk-ts',
      '@injectivelabs/networks',
      '@injectivelabs/utils',
      '@injectivelabs/ts-types',
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

        // Add specific rule for handling .d.ts files
        config.module.rules.push({
          test: /\.d\.ts$/,
          loader: 'ignore-loader'
        });

        // Add rule to ignore Trezor modules
        config.module.rules.push({
          test: /[\\/]node_modules[\\/](@trezor|@injectivelabs[\\/]wallet-trezor)[\\/]/,
          loader: path.resolve('./src/utils/null-loader.js')
        });

        // Completely exclude all Trezor-related packages
        config.resolve.alias = {
          ...config.resolve.alias,
          '@trezor/transport': require.resolve('./src/utils/empty-module.js'),
          '@trezor/connect': require.resolve('./src/utils/empty-module.js'),
          '@trezor/connect-web': require.resolve('./src/utils/empty-module.js'),
          '@trezor/utils': require.resolve('./src/utils/empty-module.js'),
          '@trezor/protocol': require.resolve('./src/utils/empty-module.js'),
          '@trezor/blockchain-link': require.resolve('./src/utils/empty-module.js'),
          '@trezor/device-utils': require.resolve('./src/utils/empty-module.js'),
          '@trezor/transport/lib/types/messages': require.resolve('./src/utils/empty-module.js'),
          '@trezor/connect/lib/data/connectSettings': require.resolve('./src/utils/empty-connectSettings.js'),
          '@injectivelabs/wallet-trezor': require.resolve('./src/utils/empty-module.js'),
        };

        // Add our custom plugin to ignore Trezor modules
        config.plugins.push(new IgnoreTrezorPlugin());
      }

      return config;
    },
    experimental: {
      externalDir: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }

  module.exports = nextConfig