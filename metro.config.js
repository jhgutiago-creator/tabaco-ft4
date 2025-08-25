const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure these file extensions are supported
config.resolver.assetExts.push('sql');

// Add support for additional platforms
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Fix for Expo Go compatibility
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;