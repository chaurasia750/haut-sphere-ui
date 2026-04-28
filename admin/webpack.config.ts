import { composePlugins, withNx } from '@nx/webpack';
import { withModuleFederation } from '@nx/module-federation/angular';
import moduleFederationConfig from './module-federation.config';

export default composePlugins(withNx(), withModuleFederation(moduleFederationConfig));
