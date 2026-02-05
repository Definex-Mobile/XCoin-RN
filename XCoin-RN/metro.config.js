const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const obfuscationConfig = require('./obfuscation.config');

const config = getDefaultConfig(__dirname);

// Only enable obfuscation in release builds
const isRelease = process.env.NODE_ENV === 'production' ||
  process.env.OBFUSCATE === 'true';

if (isRelease) {
  console.log('🔒 Obfuscation ENABLED for release build');
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    minifierPath: require.resolve('obfuscator-io-metro-plugin'),
    minifierConfig: obfuscationConfig,
  };
} else {
  console.log('🔓 Obfuscation DISABLED for debug build');
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
}

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = withNativeWind(config, { input: './global.css' });
