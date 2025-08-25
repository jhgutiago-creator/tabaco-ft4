const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure these file extensions are supported
config.resolver.assetExts.push('sql');

// Add support for additional platforms
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

module.exports = config;