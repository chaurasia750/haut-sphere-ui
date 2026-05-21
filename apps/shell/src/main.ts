// Suppress NG0912 component ID collision messages that are unavoidable in
// Module Federation setups (Material/CDK/shared components bundled in both
// the shell and remote apps). These are cosmetic warnings only — the app
// continues to work correctly.
const origConsoleError = console.error;
const origConsoleWarn = console.warn;
console.error = (...args: any[]) => {
  const msg = args.map(a => a?.message ?? a?.toString?.() ?? a ?? '').join(' ');
  if (msg.includes('NG0912')) return;
  origConsoleError.call(console, ...args);
};
console.warn = (...args: any[]) => {
  const msg = args.map(a => a?.message ?? a?.toString?.() ?? a ?? '').join(' ');
  if (msg.includes('NG0912')) return;
  origConsoleWarn.call(console, ...args);
};

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
