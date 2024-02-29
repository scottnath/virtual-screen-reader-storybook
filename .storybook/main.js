import path from 'node:path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config, options) {
    // Add node.js polyfills for Vite
    config.plugins.push(nodePolyfills({
      globals: {
        process: 'build',
      },
      overrides: {
        fs: 'memfs',
      },
      protocolImports: true,
    }));
    config.cacheDir = path.join(__dirname, '../node_modules/.vite');

    return config;
  },
};
export default config;
