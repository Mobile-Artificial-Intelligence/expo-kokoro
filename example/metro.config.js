// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Support loading binary assets like .onnx and voice .bin files
config.resolver.assetExts = [
  ...(config.resolver.assetExts || []),
  'onnx',
  'bin',
];

// npm v7+ will install ../node_modules/react and ../node_modules/react-native because of peerDependencies.
// To prevent the incompatible react-native between ./node_modules/react-native and ../node_modules/react-native,
// excludes the one from the parent folder when bundling.
config.resolver.blockList = [
  ...Array.from(config.resolver.blockList ?? []),
  new RegExp(path.resolve('..', 'node_modules', 'react')),
  new RegExp(path.resolve('..', 'node_modules', 'react-native')),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, './node_modules'),
  path.resolve(__dirname, '../node_modules'),
];

config.resolver.extraNodeModules = {
  'expo-kokoro': path.resolve(__dirname, '../src'),
};

config.watchFolders = [path.resolve(__dirname, '..')];

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
