// Mock implementation for Trezor modules
module.exports = {
  // Basic exports
  default: {},

  // Common methods and properties
  init: () => Promise.resolve({}),
  getAddress: () => Promise.resolve('mock-trezor-address'),
  ethereumSignTransaction: () => Promise.resolve({}),
  signTransaction: () => Promise.resolve({}),

  // Configuration
  manifest: {
    email: 'mock@example.com',
    appUrl: 'https://example.com'
  },

  // Constants
  TRANSPORT: {
    START: 'transport-start',
    ERROR: 'transport-error',
    UPDATE: 'transport-update',
    STREAM: 'transport-stream',
    RECONNECT: 'transport-reconnect'
  },

  // Device management
  device: {
    acquire: () => Promise.resolve({}),
    release: () => Promise.resolve({}),
    subscribe: () => Promise.resolve({})
  },

  // Message types
  MESSAGES: {},

  // Any other properties that might be accessed
  connectSrc: '',
  transportReconnect: false,
  debug: false,
  popup: false,
  webusb: false,
  pendingTransportEvent: false
};