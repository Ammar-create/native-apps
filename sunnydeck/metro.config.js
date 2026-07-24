const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Polyfill extra node module resolution for Metro bundler in Expo 51 / React Native 0.74
config.resolver.extraNodeModules = {
  'abort-controller': require.resolve('abort-controller'),
  'event-target-shim': require.resolve('event-target-shim'),
};

module.exports = config;
