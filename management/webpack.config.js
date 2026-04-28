const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  output: {
    publicPath: 'auto',
    uniqueName: 'management',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'management',
      filename: 'remoteEntry.js',
      exposes: {
        './Module': './src/app/app.module.ts',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: false },
        '@angular/common': { singleton: true, strictVersion: false },
        '@angular/router': { singleton: true, strictVersion: false },
        'rxjs': { singleton: true, strictVersion: false },
      },
    }),
  ],
};
