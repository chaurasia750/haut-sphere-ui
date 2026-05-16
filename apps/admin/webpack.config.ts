import { withModuleFederation } from '@nx/module-federation/angular';
import moduleFederationConfig from './module-federation.config';
export default withModuleFederation(moduleFederationConfig, { dts: false });

