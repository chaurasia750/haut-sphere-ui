import { composePlugins, withNx } from '@nx/webpack';
import { withModuleFederation } from '@nx/module-federation/angular';
import moduleFederationConfig from './module-federation.config';

const composed = composePlugins(withNx(), withModuleFederation(moduleFederationConfig));

export default (config, context) => {
	const cfg = composed(config, context);
	// Disable dev-server client injection (HMR websocket client) for remote builds
	// so the emitted remoteEntry doesn't pull server-only 'ws' code into the browser.
	cfg.devServer = cfg.devServer || {};
	cfg.devServer.client = false;
	cfg.devServer.hot = false;
	return cfg;
};
