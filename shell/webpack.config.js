const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (config) => {
  config.output = config.output || {};
  config.output.publicPath = 'auto';
  config.output.uniqueName = 'shell';
  
  config.plugins = config.plugins || [];
  config.plugins.push(
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        admin: 'admin@http://localhost:4201/remoteEntry.js',
        member: 'member@http://localhost:4202/remoteEntry.js',
        management: 'management@http://localhost:4203/remoteEntry.js',
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
