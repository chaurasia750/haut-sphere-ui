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
		withModuleFederation(moduleFederationConfig, { dts: false })
	)(config, context);
	
	// Post-compose: Disable dev-server HMR but keep index.html serving
	cfg.devServer = cfg.devServer || {};
	cfg.devServer.client = false;
	cfg.devServer.hot = false;
	cfg.devServer.historyApiFallback = true;
	// Ensure static files (index.html) are served from the output directory
	cfg.devServer.static = cfg.devServer.static || { directory: require('path').join(__dirname, 'src') };
	cfg.devServer.devMiddleware = cfg.devServer.devMiddleware || {};
	cfg.devServer.devMiddleware.writeToDisk = false;
	
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

