module.exports = {
  'plugins': [
    '@babel/plugin-proposal-class-properties'
  ],
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': '> 0.25%, not dead',
      },
    ],
  ],
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-runtime"]
    }
  }
};
