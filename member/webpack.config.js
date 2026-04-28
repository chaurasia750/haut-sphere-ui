const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (config) => {
  config.output = config.output || {};
  config.output.publicPath = 'auto';
  config.output.uniqueName = 'member';
  
  config.plugins = config.plugins || [];
  config.plugins.push(
    new ModuleFederationPlugin({
      name: 'member',
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
    })
  );
  
  return config;
};
