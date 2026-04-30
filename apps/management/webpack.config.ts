import { composePlugins, withNx } from '@nx/webpack';
import { withModuleFederation } from '@nx/module-federation/angular';
import moduleFederationConfig from './module-federation.config';

const StripDTSPlugin = require('../../strip-dts-plugin');

export default (config, context) => {
  // Pre-compose: mark ws packages as external
  config.externals = config.externals || {};
  config.externals['ws'] = 'commonjs ws';
  config.externals['isomorphic-ws'] = 'commonjs isomorphic-ws';
  
  // Compose with module federation and Nx
  const cfg = composePlugins(
    withNx(),
    withModuleFederation(moduleFederationConfig)
  )(config, context);
  
  // Post-compose: Disable dev-server
  cfg.devServer = cfg.devServer || {};
  cfg.devServer.client = false;
  cfg.devServer.hot = false;
  
  // Clean up plugins
  if (cfg.plugins) {
    cfg.plugins = cfg.plugins.filter(plugin => {
      if (!plugin) return false;
      const name = plugin?.constructor?.name || '';
      const skip = name.includes('DTSPlugin') || 
                   name.includes('dts-plugin') ||
                   name.includes('ForkTsChecker') ||
                   name.includes('DTSManager');
      return !skip;
    });
  }
  
  // Add strip plugin
  cfg.plugins = cfg.plugins || [];
  cfg.plugins.push(new StripDTSPlugin());
  
  return cfg;
};

