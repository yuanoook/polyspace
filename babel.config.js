module.exports = {
  'plugins': [
    [
      '@babel/plugin-proposal-class-properties'
    ],
    [
      '@babel/plugin-transform-runtime'
    ],
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
