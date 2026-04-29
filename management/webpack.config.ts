import { composePlugins, withNx } from '@nx/webpack';
import { withModuleFederation } from '@nx/module-federation/angular';
import moduleFederationConfig from './module-federation.config';

const composed = composePlugins(withNx(), withModuleFederation(moduleFederationConfig));

export default (config, context) => {
  const cfg = composed(config, context);
  cfg.devServer = cfg.devServer || {};
  cfg.devServer.client = false;
  cfg.devServer.hot = false;

