import { withModuleFederation } from '@nx/module-federation/angular';
import moduleFederationConfig from './module-federation.config';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const mfConfigPromise = withModuleFederation(moduleFederationConfig, { dts: false });

export default async (config) => {
  const mfConfig = await mfConfigPromise;
  const webpackConfig = mfConfig(config);
  webpackConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: 'apps/admin/public/web.config', to: 'web.config', noErrorOnMissing: false }
      ]
    })
  );
  return webpackConfig;
};
