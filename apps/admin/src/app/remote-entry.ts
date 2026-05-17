import AdminRemoteRootComponent from './remote-wrapper.component';

// Component-only remote entry for Module Federation. Export a tiny
// standalone root that only renders a RouterOutlet. This avoids pulling
// AppComponent and its heavy injected services into the host.
export default AdminRemoteRootComponent;
export { AdminRemoteRootComponent };
// Also export the routes so a host can register them under the remote's mount path
export { routes as adminRoutes } from './app-routing.module';
// Export AppModule for lazy-loading via loadChildren returning an NgModule class
export { AppModule } from './app.module';
