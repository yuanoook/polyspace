module.exports = {
  'plugins': [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-external-helpers'
  ],
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': '> 0.25%, not dead',
      },
    ],
  ],
};
